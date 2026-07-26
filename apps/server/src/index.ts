import { app } from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.info(`OpenLog server listening on port ${env.PORT}.`);
});

let isShuttingDown = false;

function shutdown(signal: string): void {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.info(`Received ${signal}; shutting down gracefully.`);

  server.close((error) => {
    if (error) {
      console.error('Server shutdown failed.', error);
      process.exitCode = 1;
      return;
    }

    console.info('OpenLog server stopped.');
  });
}

server.on('error', (error: Error) => {
  console.error('OpenLog server failed to start.', error);
  process.exitCode = 1;
});

process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));
