import { Router } from 'express';
import { requireAuthentication } from '../auth/auth.middleware';
import { getOwnedTrackerSummariesController } from './history.controller';

export const historyRouter = Router();

historyRouter.get('/', requireAuthentication, getOwnedTrackerSummariesController);
