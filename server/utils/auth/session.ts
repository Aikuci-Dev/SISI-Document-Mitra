import type { H3Event } from "h3";
import { useSession } from "h3";
import { defu } from "defu";
import { UserSession, UserSessionRequired } from "~~/types/session";

const config = useRuntimeConfig();
const sessionConfig = config.session;

export async function getUserSession(event: H3Event) {
  const session = await _useSession(event);
  return session.data;
}

export async function setUserSession(event: H3Event, data: UserSession) {
  const session = await _useSession(event);
  await session.update(defu(data, session.data));
  return session.data;
}

export async function clearUserSession(event: H3Event) {
  const session = await _useSession(event);
  await session.clear();
  return true;
}

export async function requireUserSession(
  event: H3Event,
  opts: { statusCode?: number; message?: string } = {}
): Promise<UserSessionRequired> {
  const userSession = await getUserSession(event);

  if (!userSession.user) {
    throw createError({
      statusCode: opts.statusCode || 401,
      message: opts.message || "Unauthorized",
    });
  }

  return userSession as UserSessionRequired;
}

function _useSession(event: H3Event) {
  return useSession<UserSession>(event, { password: sessionConfig.password });
}
