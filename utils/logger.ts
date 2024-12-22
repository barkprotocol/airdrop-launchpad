import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set default log level to 'info'
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }), // Log to console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to file
    new winston.transports.File({ filename: 'logs/combined.log' }), // Log all messages to file
  ],
});

// Custom log function for errors
export function logError(message: string, error: Error): void {
  logger.error(`${message} - ${error.stack}`);
}

// Custom log function for info messages
export function logInfo(message: string): void {
  logger.info(message);
}

// Custom log function for warnings
export function logWarn(message: string): void {
  logger.warn(message);
}

export { logger };
