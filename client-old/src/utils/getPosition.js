const getPosition = (task, user) => {
  switch (user) {
    case task.first:
      return "first";
    case task.second:
      return "second";
    case task.third:
      return "third";
    default:
      return null;
  }
};

export default getPosition;
