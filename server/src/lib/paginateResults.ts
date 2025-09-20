import { Request } from "express";
import { Model, Document } from "mongoose";

interface PaginateOptions {
  sort?: Record<string, 1 | -1>;
  select?: string;
  filters?: Record<string, any>; // Additional custom filters
}

interface PaginateResultsType<T> {
  totalLength: number;
  selectedLength: number;
  results: T[];
  adminLength?: number; // Optional, for specific use cases
}

export default async function paginateResults<T extends Document>(
  req: Request,
  model: Model<any>,
  regex: Record<string, RegExp>,
  options: PaginateOptions = {}
): Promise<PaginateResultsType<T>> {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 10)
  ); // Default 10, max 100
  const skip = (page - 1) * limit;

  try {
    // Build filters for contains (convert RegExp to MongoDB regex)
    const containsFilters: Record<string, any> = { ...options.filters };
    Object.keys(regex).forEach((key) => {
      const reg = regex[key];
      containsFilters[key] = { $regex: reg.source, $options: reg.flags };
    });

    // Build filters for startsWith (case-insensitive)
    const startsWithFilters: Record<string, any> = { ...options.filters };
    Object.keys(regex).forEach((key) => {
      const queryValue =
        typeof req.query[key] === "string"
          ? (req.query[key] as string).toLowerCase()
          : Array.isArray(req.query[key])
            ? String(req.query[key][0]).toLowerCase()
            : "";
      if (queryValue) {
        startsWithFilters[key] = { $regex: `^${queryValue}`, $options: "i" };
      }
    });

    // Use aggregation to prioritize startsWith, then contains
    const pipeline = [
      {
        $match: { $or: [startsWithFilters, containsFilters] }, // Match either startsWith or contains
      },
      {
        $addFields: {
          priority: {
            $cond: {
              if: {
                $and: Object.keys(startsWithFilters).map((key) => ({
                  $regexMatch: {
                    input: `$${key}`,
                    regex: startsWithFilters[key].$regex,
                    options: startsWithFilters[key].$options,
                  },
                })),
              },
              then: 1, // StartsWith
              else: 0, // Contains
            },
          },
        },
      },
      {
        $sort: {
          priority: -1 as 1 | -1,
          ...(options.sort || { createdAt: -1 as 1 | -1 }),
        },
      }, // Sort by priority desc, then other sort
      { $skip: skip },
      { $limit: limit },
      ...(options.select
        ? [
            {
              $project: options.select
                .split(" ")
                .reduce((acc, field) => ({ ...acc, [field]: 1 }), {}),
            },
          ]
        : []),
    ];

    const results = (await model.aggregate(pipeline).exec()) as T[];

    // Get total counts (approximate, as aggregation doesn't easily give filtered total without extra query)
    const totalLength = await model.countDocuments(containsFilters).exec(); // Total matching contains
    const selectedLength = results.length; // This page's results

    return {
      totalLength,
      selectedLength,
      results,
    };
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Pagination error");
  }
}
