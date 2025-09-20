export default function getDate(): string {
  const now = new Date();

  // Convert the time to the Asia/Dhaka time zone
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const bangladeshTime = formatter.format(now);

  return bangladeshTime;
}
