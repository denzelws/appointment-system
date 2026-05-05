import bcrypt from 'bcrypt';
import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  const password = process.env.ADMIN_PASSWORD
  const email = process.env.ADMIN_EMAIL

   if (!email || !password) {
    throw new Error('ADMIN_EMAIL ou ADMIN_PASSWORD não definidos');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await knex('users').insert({
    name: 'Administrador',
    email,
    password_hash: passwordHash,
    role: 'ADMIN',
  }).onConflict('email').ignore();
}
