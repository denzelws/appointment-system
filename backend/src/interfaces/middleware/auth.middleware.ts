import { FastifyReply, FastifyRequest } from "fastify";
import { JwtService } from "../../infrastructure/services/JwtService";

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser;
  }
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({
      status: 401,
      code: "AUTHENTICATION_REQUIRED",
      message: "Autenticação necessária.",
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return reply.status(401).send({
      status: 401,
      code: "INVALID_TOKEN_FORMAT",
      message: "Token malformado.",
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = JwtService.verifyToken(token);
    request.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        return reply.status(401).send({
          status: 401,
          code: "TOKEN_EXPIRED",
          message: "Token expirado.",
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      }
      if (error.name === "JsonWebTokenError") {
        return reply.status(401).send({
          status: 401,
          code: "INVALID_TOKEN",
          message: "Token inválido.",
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      }
    }

    return reply.status(401).send({
      status: 401,
      code: "AUTHENTICATION_FAILED",
      message: "Falha na autenticação.",
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
};

export function requireRole(role: "USER" | "ADMIN") {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user?.role !== role && request.user?.role !== "ADMIN") {
      return reply.status(403).send({
        status: 403,
        code: "FORBIDDEN",
        message: "Acesso negado.",
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  };
}
