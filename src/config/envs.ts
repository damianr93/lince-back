import dotenv from 'dotenv';
import { get } from 'env-var';

dotenv.config();

export const envs = {

  PORT: get('PORT').required().asPortNumber(),

  MAILER_HOST: get('MAILER_HOST').required().asString(),
  MAILER_PORT: get('MAILER_PORT').default('465').asPortNumber(),
  MAILER_SECURE: get('MAILER_SECURE').default('true').asBool(),

  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

  SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),

  // URL de la API de IA
  // IA_API_URL: get('IA_API_URL').required().asString(),

  IA_API_KEY: get('IA_API_KEY').required().asString(),
  IA_CONTEXT: get('IA_CONTEXT').required().asString(),

  ID_USER_MANYCHAT: get('ID_USER_MANYCHAT').required().asInt(),
  TOKEN_USER_MANYCHAT: get('TOKEN_USER_MANYCHAT').required().asString(),
}
