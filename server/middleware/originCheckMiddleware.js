const allowedOrigins = [process.env.APP_URL];

const originCheckMiddleware = async (req, res, next) => {
  const origin = req.headers.origin;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (!origin) {
    console.log(
      `----------------------\n${new Date().toString()} - Unauthorized request from IP: ${ip} - ${
        req.headers
      }\n----------------------`
    );
    return res
      .status(400)
      .send({ message: "Bad Request: Missing Origin Header" });
  }

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    next();
  } else {
    console.log(
      `----------------------\n${new Date().toString()} - Unauthorized request from IP: ${ip} - ${
        req.headers
      }\n----------------------`
    );
    return res.status(403).send({ message: "Forbidden: Unauthorized Origin" });
  }
};

module.exports = originCheckMiddleware;
