import { User, UserProps } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { UserRole } from "../../../domain/value-objects/UserRole";
import { db } from "../index";

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export class KnexUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const row = await db("users").where({ id }).first();
    if (!row) return null;
    return this.mapRowToEntity(row as UserRow);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await db("users").where({ email }).first();
    if (!row) return null;
    return this.mapRowToEntity(row as UserRow);
  }

  async create(data: UserProps): Promise<User> {
    const [row] = await db("users")
      .insert({
        name: data.name,
        email: data.email,
        password_hash: data.passwordHash,
        role: data.role,
      })
      .returning("*");

    return this.mapRowToEntity(row as UserRow);
  }

  async update(user: User): Promise<User> {
    const [row] = await db("users")
      .where({ id: user.id })
      .update({
        name: user.name,
        email: user.email,
        role: user.role,
        updated_at: new Date(),
      })
      .returning("*");

    return this.mapRowToEntity(row as UserRow);
  }

  private mapRowToEntity(row: UserRow): User {
    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}
