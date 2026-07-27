import { Router } from 'express';
import { HEALTH_PATH } from '@openlog/shared';
import { getHealth } from '../modules/health/health.controller';
import { authRouter } from '../modules/auth/auth.routes';
import { trackerRouter } from '../modules/trackers/tracker.routes';
import { historyRouter } from '../modules/history/history.routes';

export const apiRouter = Router();

apiRouter.get(HEALTH_PATH.replace('/api', ''), getHealth);
apiRouter.use('/auth', authRouter);
apiRouter.use('/me/trackers', historyRouter);
apiRouter.use('/trackers', trackerRouter);
