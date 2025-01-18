const { getDate } = require("../utils/getDate");

const allowedOrigins = [process.env.APP_URL];

const originCheckMiddleware = async (req, res, next) => {
  const origin = req.headers.origin;
  const data = req.headers["true-client-ip"] || req.headers;
  const date = getDate();
  if (!origin) {
    console.log(
      `----------------------\n${date} - Unauthorized request from  -`,
      data,
      `\n----------------------`
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
      `----------------------\n${date} - Unauthorized request from  -`,
      data,
      `\n----------------------`
    );
    return res.status(403).send({ message: "Forbidden: Unauthorized Origin" });
  }
};

module.exports = originCheckMiddleware;
