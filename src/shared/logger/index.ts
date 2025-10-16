import pino, { LoggerOptions } from 'pino';

const env = process.env.NODE_ENV ?? 'development';
const level = process.env.LOG_LEVEL ?? (env === 'production' ? 'info' : 'debug');

const base: LoggerOptions['base'] =
  env === 'production'
    ? { service: process.env.SERVICE_NAME ?? 'ecommerce-api', env }
    : { service: 'ecommerce-api', env };

const options: LoggerOptions = {
  level,
  base,
  // Em produção: JSON puro (sem transport)
  // Em dev/test: pretty printing para leitura humana
  ...(env !== 'production'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            singleLine: true,
          },
        },
      }
    : {}),
};

const logger = pino(options);

// Exporta UM logger para o app inteiro
export default logger;
