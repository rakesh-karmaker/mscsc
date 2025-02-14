exports.getDate = () => {
  const now = new Date();

  // Convert the time to the Asia/Dhaka time zone
  const options = {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const bangladeshTime = formatter.format(now);

  return bangladeshTime;
};

exports.getBdTime = () => {
  const now = new Date();
  const bangladeshOffset = 6 * 60; // Bangladesh is UTC+6

  // Get the current UTC time in minutes
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;

  // Adjust to Bangladesh time
  const bdTime = new Date(utcTime + bangladeshOffset * 60000);

  // Return the time in ISO format
  return bdTime.toISOString();
};
