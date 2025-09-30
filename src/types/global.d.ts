declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      REDIS_URL: string;
      RABBITMQ_URL: string;
      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
      JWT_EXPIRES_IN: string;
      JWT_REFRESH_EXPIRES_IN: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      SMTP_FROM: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      AWS_S3_BUCKET: string;
      AWS_S3_ENDPOINT: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      APP_PORT: string;
      APP_ENV: string;
      APP_URL: string;
      SWISSEPH_DATA_PATH: string;
      ENABLE_ML_RECOMMENDATIONS: string;
      ENABLE_ANALYTICS: string;
      ALLOWED_ORIGINS: string;
    }
  }
}

export {};
