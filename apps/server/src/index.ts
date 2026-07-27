import { app } from './app';
import { closeDatabaseConnection } from './database/client';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.info(`OpenLog server listening on port ${env.PORT}.`);
});

let isShuttingDown = false;

function getSafeErrorCode(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('code' in error)) return null;
  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' && /^[A-Z_]+$/.test(code) ? code : null;
}

function shutdown(signal: string): void {
  if (isShuttingDown) return;

  isShuttingDown = true;
  console.info(`Received ${signal}; shutting down gracefully.`);

  server.close((error) => {
    if (error) {
      console.error('Server shutdown failed.');
      process.exitCode = 1;
      return;
    }

    void closeDatabaseConnection()
      .then(() => console.info('OpenLog server stopped.'))
      .catch(() => {
        console.error('Database connection shutdown failed.');
        process.exitCode = 1;
      });
  });
}

server.on('error', (error: unknown) => {
  const code = getSafeErrorCode(error);
  console.error(
    code ? `OpenLog server failed to start (${code}).` : 'OpenLog server failed to start.'
  );
  process.exitCode = 1;
});

process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));
