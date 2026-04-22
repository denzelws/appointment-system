import { UnauthorizedException } from "../../../domain/errors/UnauthorizedException";
import { IAuditLogRepository } from "../../../domain/interfaces/IAuditLogRepository";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

import { BcryptService } from "../../../infrastructure/services/BcryptService";
import { JwtService } from "../../../infrastructure/services/JwtService";

import { LoginDTO, LoginResponseDTO } from "../../dtos/UserDTO";

export class LoginUseCase {
  constructor(
    private userRepo: IUserRepository,
    private auditRepo: IAuditLogRepository,
  ) {}

  async execute(data: LoginDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepo.findByEmail(data.email);

    if (!user) {
      await this.logAudit(null, "AUTH_LOGIN_FAILURE", {
        email: data.email,
        reason: "User not found",
      });
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    const isValidPassword = await BcryptService.compare(
      data.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      await this.logAudit(user.id, "AUTH_LOGIN_FAILURE", {
        reason: "Invalid password",
      });
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    const token = JwtService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await this.logAudit(user.id, "AUTH_LOGIN_SUCCESS", {});

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  private async logAudit(
    userId: string | null,
    eventType: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.auditRepo.create({
        userId: userId || undefined,
        eventType: eventType as any,
        payload,
      });
    } catch (error) {
      console.error("Failed to write audit log:", error);
    }
  }
}
