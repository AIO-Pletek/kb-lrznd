import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  isLoggedIn: boolean;
  username: string;
}

const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET || "change_me_to_at_least_32_char_random_string",
  cookieName: "kabe_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8, // 8 jam
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

export async function login(username: string, password: string): Promise<boolean> {
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "admin";

  if (username === adminUser && password === adminPass) {
    const session = await getSession();
    session.isLoggedIn = true;
    session.username = username;
    await session.save();
    return true;
  }
  return false;
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}
