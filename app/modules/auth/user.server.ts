import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../database/prisma.server';
import type { RegisterForm } from './types.server';

export function validateUser(
  data: Partial<RegisterForm>
): data is RegisterForm {
  return (
    typeof data.email === 'string' &&
    typeof data.password === 'string' &&
    typeof data.username === 'string'
  );
}

export async function createUser(user: RegisterForm) {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      password: passwordHash,
      email: user.email,
      profile: {
        username: user.username,
      },
    },
  });

  return { id: newUser.id, email: newUser.email };
}

export async function isKnownUser(user: { email: string }) {
  const count = await prisma.user.count({ where: { email: user.email } });
  return count > 0;
}

export async function findUser(user: { email: string }) {
  return prisma.user.findUnique({ where: { email: user.email } });
}

export async function findUserById(user: { id: string }) {
  return prisma.user.findUnique({
    where: { id: user.id },
    // select: {
    //   id: true,
    //   createdAt: true,
    //   email: true,
    //   profile: true,
    // },
  });
}

export async function isCorrectPassword(password: string, user: User) {
  return bcrypt.compare(password, user.password);
}

export async function getOtherUsers(userId: string | null) {
  return prisma.user.findMany({
    where: userId ? { id: { not: userId } } : undefined,
    orderBy: { profile: { username: 'asc' } },
    select: { id: true, profile: true },
  });
}
