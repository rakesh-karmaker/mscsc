import app from "./app.js";
import config from "./shared/config/config.js";
import mongoose from "mongoose";
import https from "https";
import dns from "node:dns/promises";

// Force DNS change if specified in config
if (config.forceDNSChange) {
  console.log("Forcing DNS change to 1.1.1.1 and 8.8.8.8");
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

// Connect to MongoDB
mongoose
  .connect(config.mongoUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// TODO: remove this when in a paid hosting
setInterval(
  () => {
    const options = {
      hostname: config.serverUrl.replace(/^https?:\/\//, ""), // Remove protocol if present
      port: 443,
      path: "/",
      method: "GET",
      headers: {
        Origin: config.serverUrl,
      },
    };

    https.get(options).on("error", (e) => {
      console.error(`Got error: ${e.message}`);
    });
  },
  2 * 60 * 1000,
); // every 2 minutes

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
