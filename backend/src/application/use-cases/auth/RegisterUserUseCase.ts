import { ConflictException } from "../../../domain/errors/ConflictException";
import { DomainException } from "../../../domain/errors/DomainException";

import { IAuditLogRepository } from "../../../domain/interfaces/IAuditLogRepository";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

import { AuthRules } from "../../../domain/rules/AuthRules";
import { BcryptService } from "../../../infrastructure/services/BcryptService";
import { CreateUserDTO, UserResponseDTO } from "../../dtos/UserDTO";

export class RegisterUserUseCase {
  constructor(
    private userRepo: IUserRepository,
    private auditRepo: IAuditLogRepository,
  ) {}

  async execute(data: CreateUserDTO): Promise<UserResponseDTO> {
    if (!AuthRules.isValidEmail(data.email)) {
      throw new DomainException("E-mail inválido.");
    }

    if (!AuthRules.isValidPassword(data.password)) {
      throw new DomainException("Senha deve ter no mínimo 8 caracteres.");
    }

    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException("E-mail já cadastrado.");
    }

    const passwordHash = await BcryptService.hash(data.password);

    const user = await this.userRepo.create({
      id: "",
      name: data.name,
      email: data.email,
      passwordHash,
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
