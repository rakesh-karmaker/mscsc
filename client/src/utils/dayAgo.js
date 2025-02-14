const dayAgo = (date) => {
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = now - time;
  console.log(time, now, diff);
  let timeAgo;

  if (diff < 60 * 1000) {
    timeAgo = Math.floor(diff / 1000) + "s";
  } else if (diff < 60 * 60 * 1000) {
    timeAgo = Math.floor(diff / (60 * 1000)) + "m";
  } else if (diff < 24 * 60 * 60 * 1000) {
    timeAgo = Math.floor(diff / (60 * 60 * 1000)) + "h";
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    timeAgo = Math.floor(diff / (24 * 60 * 60 * 1000)) + "d";
  } else if (diff < 30 * 24 * 60 * 60 * 1000) {
    timeAgo = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + "w";
  } else if (diff < 365 * 24 * 60 * 60 * 1000) {
    timeAgo = Math.floor(diff / (30 * 24 * 60 * 60 * 1000)) + "m";
  } else {
    timeAgo = Math.floor(diff / (365 * 24 * 60 * 60 * 1000)) + "y";
  }

  return timeAgo;
};

export default dayAgo;
