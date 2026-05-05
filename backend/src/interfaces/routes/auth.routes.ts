import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { login, register } from "../controllers/auth.controller";
import { loginJsonSchema, registerJsonSchema } from "../schemas/zod.schemas";

export const authRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post(
    "/auth/register",
    {
      schema: {
        body: registerJsonSchema,
      },
    },
    register,
  );

  app.post(
    "/auth/login",
    {
      schema: {
        body: loginJsonSchema,
      },
    },
    login,
  );
};
