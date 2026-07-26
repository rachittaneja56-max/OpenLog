import { checkDatabaseConnection } from '../../database/client';

export type HealthStatus = {
  status: 'ok';
  database: 'connected';
};

export async function getHealthStatus(): Promise<HealthStatus | undefined> {
  const databaseConnected = await checkDatabaseConnection();

  if (!databaseConnected) {
    return undefined;
  }

  return { status: 'ok', database: 'connected' };
}
