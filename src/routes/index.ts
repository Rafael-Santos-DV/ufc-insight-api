import { FastifyInstance } from "fastify";
import { UfcController } from "../controllers/index.js";
import { UfcService } from "../services/index.js";

const fighter = new UfcController(new UfcService());

export function routes(fastify: FastifyInstance, options: any) {
  fastify.get("/", fighter.get);
  fastify.get("/events", fighter.getEvents);
}
