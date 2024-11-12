export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const name = decodeURI(getRouterParam(event, "name") || "");
  if (name !== user.name)
    throw createError({
      statusCode: 403,
      message:
        "Forbidden: The name you provided does not match the name in your account.",
    });

  return getSpreadsheetDataByName(event, name);
});
