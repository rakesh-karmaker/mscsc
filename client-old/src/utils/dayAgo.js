const dayAgo = (date) => {
  const time = Date.parse(date); // Ensure it's in UTC
  const now = Date.now(); // Current time in UTC
  const diff = now - time;

  if (diff < 0) return "Just now"; // Prevents negative values

  if (diff < 60 * 1000) return Math.floor(diff / 1000) + "s";
  if (diff < 60 * 60 * 1000) return Math.floor(diff / (60 * 1000)) + "m";
  if (diff < 24 * 60 * 60 * 1000)
    return Math.floor(diff / (60 * 60 * 1000)) + "h";
  if (diff < 7 * 24 * 60 * 60 * 1000)
    return Math.floor(diff / (24 * 60 * 60 * 1000)) + "d";
  if (diff < 30 * 24 * 60 * 60 * 1000)
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + "w";
  if (diff < 365 * 24 * 60 * 60 * 1000)
    return Math.floor(diff / (30 * 24 * 60 * 60 * 1000)) + "m";
  return Math.floor(diff / (365 * 24 * 60 * 60 * 1000)) + "y";
};

export default dayAgo;
