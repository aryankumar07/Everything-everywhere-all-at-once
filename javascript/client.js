import Redis from "ioredis";

const publisher = new Redis();
const subscriber = new Redis();

publisher.on("error", (err) => {
  console.error("Redis publisher error:", err);
});

subscriber.on("error", (err) => {
  console.error("Redis subscriber error:", err);
});

export { publisher, subscriber };
