const axios = require("axios");
const NodeCache = require("node-cache");

const allowedOrigins = [process.env.APP_URL];
const ipGeolocationCache = new NodeCache({ stdTTL: 86400 }); // Cache for 24 hours

const originCheckMiddleware = async (req, res, next) => {
  const origin = req.headers.origin;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!origin) {
    await consoleIpData(ip);
    return res
      .status(400)
      .send({ message: "Bad Request: Missing Origin Header" });
  }

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    next();
  } else {
    await consoleIpData(ip);
    return res.status(403).send({ message: "Forbidden: Unauthorized Origin" });
  }
};

const consoleIpData = async (ip) => {
  // Skip tracing for local addresses
  if (ip === "::1" || ip === "127.0.0.1" || ip === "::ffff:127.0.0.1") {
    console.log(
      `${new Date().toString()} - Unauthorized request from local IP: ${ip}`
    );
    return;
  }

  // Check if IP geolocation data is cached
  let ipInfo = ipGeolocationCache.get(ip);
  if (!ipInfo) {
    try {
      const response = await axios.get(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IP_GEOLOCATION_API_KEY}&ip=${ip}`
      );
      ipInfo = response.data;
      ipGeolocationCache.set(ip, ipInfo); // Cache the IP geolocation data
      console.log(
        `${new Date().toString()} - Unauthorized request from IP Info: ${JSON.stringify(
          ipInfo
        )}`
      );
    } catch (error) {
      console.error(
        `Error tracing IP: ${error.message} - ${ip} - ${new Date().toString()}`
      );
    }
  } else {
    console.log(
      `${new Date().toString()} - Unauthorized request from IP Info: ${JSON.stringify(
        ipInfo
      )}`
    );
  }
};

module.exports = originCheckMiddleware;
