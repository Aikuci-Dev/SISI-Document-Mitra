import { useValidatedBody, z } from 'h3-zod';
import { Roles } from '~~/types/user';

export default defineEventHandler(async (event) => {
  const { role } = await useValidatedBody(event, {
    role: z.nativeEnum(Roles),
  });

  let name, email;
  switch (role) {
    case Roles.user:
      name = 'Muhammad Achsan Hujjatul Islam';
      email = 'user@gmail.com';
      break;
    case Roles.supervisor:
      name = 'Andy Winata';
      email = 'supervisor@gmail.com';
      break;

    default:
      name = 'Admin';
      email = 'admin@gmail.com';
      break;
  }
  const googleId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

  const user = await useDB()
    .insert(tables.userGoogle)
    .values({
      googleId,
      email,
      name,
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [tables.userGoogle.email],
      set: {
        googleId,
        updatedAt: new Date(),
      },
    })
    .returning()
    .get({
      googleId: tables.userGoogle.googleId,
      email: tables.userGoogle.email,
      name: tables.userGoogle.name,
    });

  const userSession = {
    name: user.name,
    role: [role],
  };
  await setUserSession(event, { user: userSession });

  return userSession;
});
