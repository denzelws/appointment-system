import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import {
  ConflictException,
  DomainException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "../../domain/errors";

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  request.log.error(error);

  if (error instanceof ConflictException) {
    return reply.status(409).send({
      status: 409,
      code: "CONFLICT",
      message: error.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  if (error instanceof NotFoundException) {
    return reply.status(404).send({
      status: 404,
      code: "NOT_FOUND",
      message: error.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  if (error instanceof ForbiddenException) {
    return reply.status(403).send({
      status: 403,
      code: "FORBIDDEN",
      message: error.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  if (error instanceof UnauthorizedException) {
    return reply.status(401).send({
      status: 401,
      code: "UNAUTHORIZED",
      message: error.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  if (error instanceof DomainException) {
    return reply.status(400).send({
      status: 400,
      code: "BAD_REQUEST",
      message: error.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  if (error.validation) {
    return reply.status(400).send({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Dados inválidos.",
      errors: error.validation,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  return reply.status(500).send({
    status: 500,
    code: "INTERNAL_ERROR",
    message: "Erro interno do servidor.",
    timestamp: new Date().toISOString(),
    path: request.url,
  });
};
