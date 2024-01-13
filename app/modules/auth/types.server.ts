import type { User as DBUser } from "@prisma/client";

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface User {
  id: DBUser["id"];
  createdAt: DBUser["createdAt"];
  email: DBUser["email"];
  profile: DBUser["profile"];
}

export interface ClientUser {
  id: User["id"];
  profile: User["profile"];
}
