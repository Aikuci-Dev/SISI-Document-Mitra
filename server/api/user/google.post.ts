import { LibsqlError } from '@libsql/client';
import { useValidatedBody, z } from 'h3-zod';

export default defineEventHandler(async (event) => {
  const adminEmailsEnv = useRuntimeConfig(event).user.admin.email;
  const adminEmails = adminEmailsEnv.replace(/\s/g, '').split(',');

  const { id, email, name } = await useValidatedBody(event, {
    id: z.number(),
    email: z.string().email(),
    name: z.string().min(2),
  });

  const existingUser = await useDB()
    .select({ email: tables.userGoogle.email })
    .from(tables.userGoogle)
    .where(eq(columnLower(tables.userGoogle.name), name.toLowerCase())).get();

  if (existingUser?.email) throw createError({
    statusCode: 409,
    statusMessage: `Conflict with an existing user (email: ${existingUser.email}). >> Please use your real name and contact support if the issue persists.`,
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
    }).catch((error) => {
      if (error instanceof LibsqlError) {
        if (error.message.startsWith('SQLITE_CONSTRAINT'))
          throw createError({
            statusCode: 409,
            statusMessage: `Conflict with an existing user. >> Please use other email OR contact support if the issue persists.`,
          });

        console.error(error);
      }

      throw createError('Something went wrong. >> Please contact support.');
    });

  await setUserSession(event, {
    user: {
      name: user.name,
      role: adminEmails.includes(email) ? ['admin'] : undefined,
    },
  });

  return { id: user.googleId, email: user.email, name: user.name };
});
