import { OAuth2Client, TokenPayload } from "google-auth-library";

const client = new OAuth2Client();

const googleConfig = useRuntimeConfig().public.auth.google;

export async function verifyCredential(idToken: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: googleConfig.clientId,
    });
    return ticket.getPayload();
  } catch (error) {
    if (error instanceof Error) {
      const [message, detail] = error.message.split(":");
      throw createError({ statusCode: 401, statusMessage: message });
    }
  }
}
