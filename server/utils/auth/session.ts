import type { H3Event } from 'h3';
import { useSession } from 'h3';
import { defu } from 'defu';
import { z } from 'zod';
import type { UserSession, UserSessionRequired } from '~~/types/session';

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
  opts: { statusCode?: number; message?: string } = {},
): Promise<UserSessionRequired> {
  const userSession = await getUserSession(event);

  if (!userSession.user) {
    throw createError({
      statusCode: opts.statusCode || 401,
      message: opts.message || 'Unauthorized',
    });
  }

  return userSession as UserSessionRequired;
}

export async function verifyUserAuthorizationByRole(
  event: H3Event,
  opts: { role: string[] },
) {
  const { user } = await requireUserSession(event);

  const hasPermission = user.role && opts.role.some(role => user.role!.includes(role));
  if (!hasPermission) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden. >> Your role is not in scope, you don\'t have permission to perform this action.',
    });
  }

  return user;
}

function _useSession(event: H3Event) {
  return useSession<UserSession>(event, { password: sessionConfig.password });
}

const sessionPayloadSchema = z.object({
  name: z.string().optional(),
});

export async function verifyUserAuthorizationByName(
  event: H3Event,
  opts: { hasBodyPayload?: boolean; name?: string; errorMessage?: string } = {},
) {
  const { user } = await requireUserSession(event);

  let name = '';
  if (opts.name) name = opts.name;
  else {
    const { data: query } = await getValidatedQuery(event, query => sessionPayloadSchema.safeParse(query));
    if (query?.name) name = query.name;

    const param = getRouterParam(event, 'name');
    if (param) name = decodeURI(param);

    if (opts.hasBodyPayload) {
      const { data: body } = await readValidatedBody(event, body => sessionPayloadSchema.safeParse(body));
      if (body?.name) name = body.name;
    }
  }

  if (name !== user.name) {
    throw createError({
      statusCode: 403,
      statusMessage: opts.errorMessage || 'Forbidden. >> The name you provided does not match the name in your account.',
    });
  }

  return user;
}
