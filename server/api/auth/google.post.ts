export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const payload = await readBody(event);

  if (payload.g_csrf_token !== cookies.g_csrf_token)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const googleJWT = await verifyCredential(payload.credential);
  return googleJWT!.sub;
});
