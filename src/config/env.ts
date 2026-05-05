import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "The Database URL must be specified in the environment variables",
  );
}
if (process.env.PORT && isNaN(Number(process.env.PORT))) {
  throw new Error("The PORT environment variable must be a number");
}

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error(
    "The ACCESS_TOKEN_SECRET environment variable must be at least 32 characters long",
  );
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error(
    "The REFRESH_TOKEN_SECRET environment variable must be at least 32 characters long",
  );
}

if (!process.env.ACCESS_TOKEN_EXPIRES_IN) {
  throw new Error(
    "The ACCESS_TOKEN_EXPIRES_IN environment variable must be in the format of a number followed by 's', 'm', 'h', or 'd'",
  );
}

if (!process.env.REFRESH_TOKEN_EXPIRES_IN) {
  throw new Error(
    "The REFRESH_TOKEN_EXPIRES_IN environment variable must be in the format of a number followed by 's', 'm', 'h', or 'd'",
  );
}

export const appConfig = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: Number(process.env.PORT ?? 3000),
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
};
