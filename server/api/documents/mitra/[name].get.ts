export default defineEventHandler(async (event) => {
  const user = await verifyUserAuthorizationByName(event);
  return getDataTableWithStatusByName(event, user.name);
});
