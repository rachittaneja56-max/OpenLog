import { Router } from 'express';
import { HEALTH_PATH } from '@openlog/shared';
import { getHealth } from '../modules/health/health.controller';

export const apiRouter = Router();

apiRouter.get(HEALTH_PATH.replace('/api', ''), getHealth);
