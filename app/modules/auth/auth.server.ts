import { json, redirect } from "@remix-run/node";
import { sessionStorage } from "./sessions";
import type { LoginForm, RegisterForm } from "./types.server";
import {
  createUser,
  findUser,
  findUserById,
  isCorrectPassword,
  isKnownUser,
  validateUser,
} from "./user.server";

export async function register(data: RegisterForm) {
  if (!validateUser(data)) {
    return json({ error: "Incomplete RegisterForm" }, { status: 400 });
  }
  const userExists = await isKnownUser(data);
  if (userExists) {
    return json({ error: "User already exists" }, { status: 400 });
  }
  const user = await createUser(data);
  if (!user) {
    return json(
      { error: "User was not created and this is unexpected" },
      { status: 500 }
    );
  }
  return { id: user.id, email: user.email };
}

export function validateLoginForm(data: Partial<LoginForm>): data is LoginForm {
  return typeof data.email === "string" && typeof data.password === "string";
}

export async function login(data: LoginForm) {
  if (!validateLoginForm(data)) {
    return json({ error: "Incomplete LoginForm" }, { status: 400 });
  }
  const user = await findUser(data);
  if (!user) {
    return json({ error: "User not found" }, { status: 400 });
  }
  const canAuthenticate = await isCorrectPassword(data.password, user);
  if (!canAuthenticate) {
    return json({ error: "Incorrect password" }, { status: 401 });
  }
  return { id: user.id, email: user.email };
}

export async function createUserSession({
  cookieHeader,
  userId,
  redirectTo,
}: {
  cookieHeader: string | null;
  userId: string;
  redirectTo: string;
}) {
  const session = await sessionStorage.getSession(cookieHeader);
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function requireAuth({ request }: { request: Request }) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const { pathname, search } = new URL(request.url);
    const params = new URLSearchParams({ next: `${pathname}/${search}` });
    throw redirect(`/login?${params}`);
  }
  return { userId };
}

export async function logout({ request }: { request: Request }) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getUserFromSession({ request }: { request: Request }) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId") as string | undefined;
  if (!userId) {
    return null;
  }
  const user = await findUserById({ id: userId });
  if (!user) {
    throw await logout({ request });
  }
  return user;
}
