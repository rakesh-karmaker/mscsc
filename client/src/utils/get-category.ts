export default function getCategory(gradeValue: string): string {
  const parsedGrade = parseInt(gradeValue.replace(/\D/g, ""), 10);

  if (isNaN(parsedGrade)) {
    if (gradeValue.startsWith("ssc")) {
      return "Secondary";
    }
  } else if (parsedGrade >= 1 && parsedGrade <= 5) {
    return "Primary";
  } else if (parsedGrade >= 6 && parsedGrade <= 8) {
    return "Junior";
  } else if (parsedGrade >= 9 && parsedGrade <= 10) {
    return "Secondary";
  } else if (parsedGrade >= 11 && parsedGrade <= 12) {
    return "Higher Secondary";
  }
  return "Other";
}
