const cors = require("cors");
const express = require("express");
const NodeCache = require("node-cache");
const cron = require("node-cron");
const cache = new NodeCache({ stdTTL: 3600 });

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(cachedResponse);
  }

  console.log(`Cache miss for ${key}`);
  res.originalSend = res.send;
  res.send = (body) => {
    cache.set(key, body);
    console.log(`Cache set for ${key}`);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.originalSend(body);
  };
  next();
};

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// -------------------------------------------------------------------------------------------------------

const getIfsc = require("./others/checkIfsc");
const geBankDetails = require("./others/geBankDetails");
const getPincode = require("./others/getPincode");

// -------------------------------------------------------------------------------------------------------

app.use("/api/getIfsc", getIfsc);
app.use("/api/geBankDetails", cacheMiddleware, geBankDetails);
app.use("/api/getPincode", cacheMiddleware, getPincode);

// -------------------------------------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/clearCache", (req, res) => {
  console.log("Cache cleared successfully");
  cache.flushAll();
  res.send("Cache cleared successfully");
});

cron.schedule("0 */6 * * *", () => {
  console.log("Clearing specific cache keys every 6 hours");
  cache.flushAll();
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${3000}/api`);
});
