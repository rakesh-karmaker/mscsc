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

  const bangladeshTime = now.toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
  });

  const time = new Date(bangladeshTime);
  return time;
};
