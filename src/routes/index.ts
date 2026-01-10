import { FastifyInstance } from "fastify";

export function routes(fastify: FastifyInstance, options: any) {
  fastify.get("/", async (request, reply) => {
    console.log(request);
  });
}
