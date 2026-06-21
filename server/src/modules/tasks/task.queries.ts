import Task from "./task.model.js";

export async function getTaskQuery(slug: string, memberId: string) {
  // Find the task and filter the submissions
  const task = await Task.aggregate([
    { $match: { slug } },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        summary: 1,
        instructions: 1,
        deadline: 1,
        category: 1,
        createdAt: 1,
        first: 1,
        second: 1,
        third: 1,
        imageRequired: 1,
        submissions: {
          $map: {
            input: "$submissions",
            as: "sub",
            in: {
              memberId: "$$sub.memberId",
              poster: {
                $cond: {
                  if: {
                    $eq: [{ $toString: "$$sub.memberId" }, memberId],
                  },
                  then: "$$sub.poster",
                  else: "$$REMOVE",
                },
              },
              submissionDate: "$$sub.submissionDate",
              answer: {
                $cond: {
                  if: {
                    $eq: [{ $toString: "$$sub.memberId" }, memberId],
                  },
                  then: "$$sub.answer",
                  else: "$$REMOVE",
                },
              },
            },
          },
        },
      },
    },
  ]);

  return task[0];
}
