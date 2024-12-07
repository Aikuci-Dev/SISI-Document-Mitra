export default defineEventHandler(async (event) => {
  const adminEmailsEnv = useRuntimeConfig(event).user.admin.email;
  const adminEmails = adminEmailsEnv.replace(/\s/g, '').split(',');

  const cookies = parseCookies(event);
  const payload = await readBody(event);

  if (payload.g_csrf_token !== cookies.g_csrf_token)
    throw createError({ statusCode: 401 });

  const googleJWT = await verifyCredential(payload.credential);
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
