import z from "zod";

const envSchema = z.object({
    PORT: z.string(),
    DATABASE_URL: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRY: z.string(),
    REFRESH_TOKEN_EXPIRY: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success){
    console.log("Invalid environment variables");
    process.exit(1);
}

export const env = parsed.data;