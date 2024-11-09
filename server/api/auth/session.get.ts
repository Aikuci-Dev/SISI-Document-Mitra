export default eventHandler(async (event) => {
  const session = await getUserSession(event);

  const { secure, ...data } = session;

  return data;
});
