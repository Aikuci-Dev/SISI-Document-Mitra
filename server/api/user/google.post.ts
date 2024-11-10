import { useValidatedBody, z } from "h3-zod";

export default eventHandler(async (event) => {
  const { id, email, name } = await useValidatedBody(event, {
    id: z.number(),
    email: z.string().email(),
    name: z.string().min(2),
  });

  const user = await useDB()
    .insert(tables.userGoogle)
    .values({
      googleId: id,
      email,
      name,
      createdAt: new Date(),
    })
    .returning()
    .get({
      googleId: tables.userGoogle.googleId,
      email: tables.userGoogle.email,
      name: tables.userGoogle.name,
    });

  await setUserSession(event, {
    user: { name: user.name },
  });

  return { id: user.googleId, email: user.email, name: user.name };
});
