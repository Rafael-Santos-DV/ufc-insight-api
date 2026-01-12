import { FastifyInstance } from "fastify";
import { UfcController } from "../controllers/index.js";
import { UfcService } from "../services/index.js";

export async function routes(fastify: FastifyInstance, options: any) {
  const fighter = new UfcController(new UfcService(fastify.redis));

  fastify.get("/", fighter.get);
  fastify.get("/events", fighter.getEvents);
  fastify.get("/events/:eventName", fighter.getEvent);
}
