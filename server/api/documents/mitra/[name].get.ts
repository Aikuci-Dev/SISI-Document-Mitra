export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const name = decodeURI(getRouterParam(event, "name") || "");
  if (name !== user.name)
    throw createError({
      statusCode: 403,
      message:
        "Forbidden: The name you provided does not match the name in your account.",
    });

  // REF: https://www.youtube.com/watch?v=Zli-u9kxw0w
  return getSpreadsheetDataByName(event, name);
});
