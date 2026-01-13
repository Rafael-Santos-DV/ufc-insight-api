export const schema = {
  type: "object",
  required: ["REDIS_HOST", "REDIS_PASS", "REDIS_PORT", "NODE_ENV"],
  properties: {
    REDIS_USER: { type: "string", default: "default" },
    REDIS_HOST: { type: "string" },
    REDIS_PASS: { type: "string" },
    REDIS_PORT: { type: "number" },
    NODE_ENV: {
      type: "string",
      default: "development",
    },
  },
};

declare module "fastify" {
  interface FastifyInstance {
    config: {
      REDIS_USER?: string;
      REDIS_HOST: string;
      REDIS_PASS: string;
      REDIS_PORT: number;
      NODE_ENV: string;
    };
  }
}
