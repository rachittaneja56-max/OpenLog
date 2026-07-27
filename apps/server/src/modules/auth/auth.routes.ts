import rateLimit from 'express-rate-limit';
import { Router, type NextFunction, type Request, type Response } from 'express';
import { ERROR_CODES } from '@openlog/shared';
import { HttpError } from '../../errors/http-error';
import { getFieldErrors } from '../../utils/validation';
import { optionalAuthentication } from './auth.middleware';
import {
  claimTrackerController,
  loginController,
  logoutController,
  meController,
  registerController,
} from './auth.controller';
import { authCredentialsSchema, claimTrackerSchema } from './auth.schemas';
import type { AuthRouteLocals } from './auth.types';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_request, response) => {
    response.status(429).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMITED,
        message: 'Too many sign-in attempts. Please try again later.',
      },
    });
  },
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_request, response) => {
    response.status(429).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMITED,
        message: 'Too many account creation attempts. Please try again later.',
      },
    });
  },
});

const claimLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_request, response) => {
    response.status(429).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMITED,
        message: 'Too many claim attempts. Please try again later.',
      },
    });
  },
});

function validateCredentials(
  request: Request,
  response: Response<unknown, AuthRouteLocals>,
  next: NextFunction
): void {
  const parsed = authCredentialsSchema.safeParse(request.body);
  if (!parsed.success) {
    next(
      new HttpError(
        400,
        ERROR_CODES.INVALID_REQUEST,
        'Invalid account input.',
        getFieldErrors(parsed.error)
      )
    );
    return;
  }

  response.locals.authInput = parsed.data;
  next();
}

function validateClaim(
  request: Request,
  response: Response<unknown, AuthRouteLocals>,
  next: NextFunction
): void {
  const parsed = claimTrackerSchema.safeParse(request.body);
  if (!parsed.success) {
    next(
      new HttpError(
        400,
        ERROR_CODES.INVALID_REQUEST,
        'Invalid claim input.',
        getFieldErrors(parsed.error)
      )
    );
    return;
  }

  response.locals.claimInput = parsed.data;
  next();
}

authRouter.post('/login', loginLimiter, validateCredentials, loginController);
authRouter.post('/register', registerLimiter, validateCredentials, registerController);
authRouter.post('/logout', logoutController);
authRouter.get('/me', optionalAuthentication, meController);
authRouter.post(
  '/claim',
  claimLimiter,
  optionalAuthentication,
  validateClaim,
  claimTrackerController
);
