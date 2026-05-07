import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { cancel, confirm, create, list } from "../controllers/appointment.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createAppointmentJsonSchema,
  idParamJsonSchema,
  listAppointmentsJsonSchema,
} from "../schemas/zod.schemas";

export const appointmentRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
) => {
  app.addHook("preHandler", authMiddleware);

  app.post(
    "/appointments",
    {
      schema: {
        body: createAppointmentJsonSchema,
      },
    },
    create,
  );

  app.get(
    "/appointments",
    {
      schema: {
        querystring: listAppointmentsJsonSchema,
      },
    },
    list,
  );

  app.patch(
    "/appointments/:id/cancel",
    {
      schema: {
        params: idParamJsonSchema,
      },
    },
    cancel,
  );

  app.patch('/appointments/:id/confirm', {
  schema: {
    params: idParamJsonSchema,
  },
}, confirm);
};
