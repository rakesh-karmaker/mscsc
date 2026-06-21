export default function getPosition(task: any, userId: string) {
  if (!task.first && !task.second && !task.third) {
    return null;
  }
  switch (userId) {
    case task.first?.toString():
      return "first";
    case task.second?.toString():
      return "second";
    case task.third?.toString():
      return "third";
    default:
      return null;
  }
}
