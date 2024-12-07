export default defineEventHandler(async (event) => {
  const user = await verifyUserAuthorizationByName(event);
  return getDataTableByName(event, user.name);
});
