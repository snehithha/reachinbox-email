export const appConfig = {
  port: Number(process.env.PORT) || 5000,
  workerConcurrency: Number(process.env.WORKER_CONCURRENCY) || 5,
  minEmailDelay: Number(process.env.MIN_EMAIL_DELAY) || 2000,
  maxEmailsPerHour: Number(process.env.MAX_EMAILS_PER_HOUR) || 200,
};