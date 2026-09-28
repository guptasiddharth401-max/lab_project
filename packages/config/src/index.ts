export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  database: {
    url: string;
  };
  session: {
    secret: string;
    expiryHours: number;
  };
  otp: {
    expiryMinutes: number;
    maxAttempts: number;
    rateLimitWindow: number;
    rateLimitMax: number;
  };
  timezone: string;
  cors: {
    origins: string[];
  };
}

export function loadConfig(): AppConfig {
  return {
    port: parseInt(process.env.API_PORT || '3000'),
    nodeEnv: (process.env.NODE_ENV as any) || 'development',
    database: {
      url: process.env.DATABASE_URL || '',
    },
    session: {
      secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
      expiryHours: 24,
    },
    otp: {
      expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '5'),
      maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3'),
      rateLimitWindow: parseInt(process.env.OTP_RATE_LIMIT_WINDOW_MINUTES || '1'),
      rateLimitMax: parseInt(process.env.OTP_RATE_LIMIT_MAX_REQUESTS || '3'),
    },
    timezone: process.env.DEFAULT_TIMEZONE || 'Asia/Kolkata',
    cors: {
      origins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3001').split(','),
    },
  };
}
