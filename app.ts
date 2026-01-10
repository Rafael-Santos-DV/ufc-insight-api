import Fastify from "fastify";
import { routes } from "./src/routes/index.js";

const fastify = Fastify({
  logger: true,
});

fastify.register(routes);

fastify.listen({ port: 3000, host: "0.0.0.0" }).then(() => {
  console.log("running in port 3000");
});
