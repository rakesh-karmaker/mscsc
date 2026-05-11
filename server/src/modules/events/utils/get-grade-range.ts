export default function getGradeRange(categories: string[]) {
  const ranges = [];

  for (const category of categories) {
    switch (category) {
      case "primary":
        ranges.push({
          $and: [{ grade: { $gte: "1" } }, { grade: { $lte: "5" } }],
        });
        break;
      case "junior":
        ranges.push({
          $and: [{ grade: { $gte: "6" } }, { grade: { $lte: "8" } }],
        });
        break;
      case "secondary":
        ranges.push({
          $or: [
            { grade: "ssc" },
            { $and: [{ grade: { $gte: "9" } }, { grade: { $lte: "10" } }] },
          ],
        });
        break;
      case "higher secondary":
        ranges.push({
          $and: [{ grade: { $gte: "11" } }, { grade: { $lte: "12" } }],
        });
        break;
    }
  }

  return ranges.length > 0 ? { $or: ranges } : {};
}
