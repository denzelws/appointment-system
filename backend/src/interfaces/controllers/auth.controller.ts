import { FastifyReply, FastifyRequest } from "fastify";
import { LoginUseCase } from "../../application/use-cases/auth/LoginUseCase";
import { RegisterUserUseCase } from "../../application/use-cases/auth/RegisterUserUseCase";
import { KnexAuditLogRepository } from "../../infrastructure/database/repositories/KnexAuditLogRepository";
import { KnexUserRepository } from "../../infrastructure/database/repositories/KnexUserRepository";
import { LoginInput, RegisterInput } from "../schemas/zod.schemas";

const userRepo = new KnexUserRepository();
const auditRepo = new KnexAuditLogRepository();

const registerUseCase = new RegisterUserUseCase(userRepo, auditRepo);
const loginUseCase = new LoginUseCase(userRepo, auditRepo);

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = request.body as RegisterInput;

  const user = await registerUseCase.execute({
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return reply.status(201).send({
    status: 201,
    code: "USER_CREATED",
    message: "Usuário cadastrado com sucesso.",
    data: user,
    timestamp: new Date().toISOString(),
  });
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as LoginInput;

  const result = await loginUseCase.execute({
    email: data.email,
    password: data.password,
  });

  return reply.status(200).send({
    status: 200,
    code: "LOGIN_SUCCESS",
    message: "Login realizado com sucesso.",
    data: result,
    timestamp: new Date().toISOString(),
  });
};
