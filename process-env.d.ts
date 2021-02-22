declare namespace NodeJS {
  interface ProcessEnv {
    // API
    NODE_ENV: 'development' | 'test' | 'production' | 'ci' | 'aws';
    PROTOCOL: string;
    HOST: string;
    PORT: number;
    LOGGING_LEVEL: 'error' | 'warn' | 'verbose' | 'info' | 'debug';
    CORS_WHITE_LIST: string;
    FRONTEND_URL: string;
    JWT_PRIVATE_KEY: string;
    EMAIL_VERIFICATION_TOKEN_SECRET: string;
    PASSWORD_RESET_TOKEN: string;
    ENV_NAMESPACE: 'stagging' | 'dev' | 'qa' | 'production';

    // Postgres Database envs
    POSTGRES_MIGRATION_PATH: string;
    POSTGRES_PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTRGRES_HOSTNAME: string;
  }
}
