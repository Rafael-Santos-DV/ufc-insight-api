import Fastify from "fastify";
import { routes } from "./src/routes/index.js";
import fastifyRedis from "@fastify/redis";
import { connectionRedis } from "./src/lib/redis.js";

const fastify = Fastify({
  logger: true,
  // pluginTimeout: 20000,
});

fastify.register(fastifyRedis, connectionRedis);

fastify.register(routes);

fastify
  .listen({ port: 3000, host: "0.0.0.0" })
  .then(() => {
    console.log("running in port 3000");
  })
  .catch((err) => console.log("erro: ", err));
