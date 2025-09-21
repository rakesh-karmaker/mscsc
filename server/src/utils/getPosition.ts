export default function getPosition(task: any, username: string) {
  if (!task.first && !task.second && !task.third) {
    return null;
  }
  switch (username) {
    case task.first:
      return "first";
    case task.second:
      return "second";
    case task.third:
      return "third";
    default:
      return null;
  }
}
