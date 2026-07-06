import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  app_rul: process.env.APP_URL,
  jwt_access_token: process.env.JWT_ACCESS_TOKEN!,
  jwt_refresh_token: process.env.JWT_REFRESH_TOKEN,
  jwt_access_token_expire_in: process.env.JWT_ACCESS_TOKEN_EXPIRE_IN,
  jwt_refresh_token_expire_in: process.env.JWT_REFRESH_TOKEN_EXPIRE_IN,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
};