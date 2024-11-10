export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const payload = await readBody(event);

  if (payload.g_csrf_token !== cookies.g_csrf_token)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const googleJWT = await verifyCredential(payload.credential);
  const googleId = parseInt(googleJWT!.sub);

  const selectField = {
    prefilled_name: aliasedColumn(tables.userGoogle.googleName, "google_name"),
  };

  let user = await useDB()
    .select(selectField)
    .from(tables.userGoogle)
    .where(eq(tables.userGoogle.googleId, googleId))
    .get();

  if (!user)
    user = await useDB()
      .insert(tables.userGoogle)
      .values({
        googleId,
        email: googleJWT?.email!,
        googleName: googleJWT?.name!,
        createdAt: new Date(),
      })
      .returning(selectField)
      .get();

  await setUserSession(event, { user });

  return sendRedirect(event, "/document");
});
