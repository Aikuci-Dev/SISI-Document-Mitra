import { z } from 'zod';

// See: https://developers.google.com/identity/gsi/web/reference/html-reference#server-side
const payloadSchema = z.object({
  g_csrf_token: z.string(),
  credential: z.string(),
});

export default defineEventHandler(async (event) => {
  const adminEmailsEnv = useRuntimeConfig(event).user.admin.email;
  const adminEmails = adminEmailsEnv.replace(/\s/g, '').split(',');

  const cookies = parseCookies(event);
  const body = await readValidatedBody(event, body => payloadSchema.parse(body));

  if (body.g_csrf_token !== cookies.g_csrf_token)
    throw createError({ statusCode: 401 });

  const googleJWT = await verifyCredential(body.credential);
  const { sub: id, email, name } = googleJWT!;
  const googleId = parseInt(id);

  const user = await useDB()
    .select({ name: tables.userGoogle.name })
    .from(tables.userGoogle)
    .where(
      or(
        eq(tables.userGoogle.googleId, googleId),
        email ? eq(tables.userGoogle.email, email) : undefined,
      ),
    )
    .get();

  const isAdmin = email && adminEmails.includes(email);
  await setUserSession(event, {
    user: {
      oauth: { id: googleId, email, name },
      name: user?.name,
      role: isAdmin ? ['admin'] : undefined,
    },
  });

  return sendRedirect(event, '/dashboard');
});
