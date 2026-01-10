import { FastifyRequest, FastifyReply } from "fastify";
import { UfcService } from "../services/index.js";

export class UfcController {
  constructor(private ufcService: UfcService) {}

  public get = (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ status: 200, message: "tudo ok" });
  };

  public getEvents = async (request: FastifyRequest, reply: FastifyReply) => {
    const response = await this.ufcService.events();
    reply.send(response);
  };

  public getFight = async () => {
    return "fight";
  };

  public getFights = async () => {
    return "fights";
  };
}
