const getPosition = (task, username) => {
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
};

module.exports = getPosition;
