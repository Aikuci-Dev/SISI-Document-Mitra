// REF: https://github.com/atinux/nuxt-auth-utils/blob/main/src/runtime/server/utils/session.ts

import type { H3Event } from "h3";
import { useSession } from "h3";
import { defu } from "defu";
import { UserSession } from "~~/types/session";

const config = useRuntimeConfig();
const sessionConfig = config.session;

/**
 * Get the user session from the current request
 * @param event The Request (h3) event
 * @returns The user session
 */
export async function getUserSession(event: H3Event) {
  return (await _useSession(event)).data;
}

/**
 * Set a user session
 * @param event The Request (h3) event
 * @param data User session data, please only store public information since it can be decoded with API calls
 * @see https://github.com/atinux/nuxt-auth-utils
 */
export async function setUserSession(event: H3Event, data: UserSession) {
  const session = await _useSession(event);

  await session.update(defu(data, session.data));

  return session.data;
}

/**
 * Clear the user session and removing the session cookie
 * @param event The Request (h3) event
 * @returns true if the session was cleared
 */
export async function clearUserSession(event: H3Event) {
  const session = await _useSession(event);

  await session.clear();

  return true;
}

function _useSession(event: H3Event) {
  return useSession<UserSession>(event, { password: sessionConfig.password });
}
