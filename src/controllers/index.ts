import { FastifyRequest, FastifyReply } from "fastify";
import { UfcService } from "../services/index.js";
import { FastifyRedis } from "@fastify/redis";

export class UfcController {
  constructor(
    private ufcService: UfcService // private fastifyRedis: FastifyRedis
  ) {}

  public get = (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ status: 200, message: "tudo ok" });
  };

  public getEvents = async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.query as { limit: number; skip: number };

    const limit = params.limit ?? 10;
    const skip = params.skip ?? 0;

    const response = await this.ufcService.getEvents({ skip, limit });

    reply.send(response);
  };

  public getEvent = async (request: FastifyRequest, reply: FastifyReply) => {
    const { eventName } = request.params as { eventName: string };

    if (!eventName) throw new Error("Missing eventId params => getEvent");

    const response = await this.ufcService.getEvent(eventName);

    reply.send(response);
  };
}
