import Fastify from "fastify";
import { routes } from "./routes/index.js";
import fastifyRedis from "@fastify/redis";
import fastifyEnv from "@fastify/env";
import { schema } from "./lib/env.js";
import path from "node:path";

const fastify = Fastify({
  logger: true,
  // pluginTimeout: 20000,
});

async function start() {
  try {
    console.log("path: ", path.resolve(process.cwd(), ".env"));
    await fastify.register(fastifyEnv, {
      confKey: "config",
      schema,
      dotenv: {
        path: path.resolve(process.cwd(), ".env"),
        debug: true,
      },
    });

    await fastify.register(fastifyRedis, {
      username: fastify.config.REDIS_USER,
      host: fastify.config.REDIS_HOST,
      password: fastify.config.REDIS_PASS,
      port: fastify.config.REDIS_PORT,
    });
    await fastify.register(routes);

    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: "0.0.0.0" });

    console.log("running in port 3000");
  } catch (err: any) {
    throw new Error(err);
  }
}

start();
