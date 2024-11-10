export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const payload = await readBody(event);

  if (payload.g_csrf_token !== cookies.g_csrf_token)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const googleJWT = await verifyCredential(payload.credential);
  const { sub: id, email, name } = googleJWT!;
  const googleId = parseInt(id);

  const user = await useDB()
    .select({ name: tables.userGoogle.name })
    .from(tables.userGoogle)
    .where(
      or(
        eq(tables.userGoogle.googleId, googleId),
        email ? eq(tables.userGoogle.email, email) : undefined
      )
    )
    .get();

  await setUserSession(event, {
    user: {
      oauth: { id: googleId, email, name },
      name: user ? user.name : undefined,
    },
  });

  if (!user) return sendRedirect(event, "/onboarding");
  return sendRedirect(event, "/document");
});
