import type { Request, Response } from 'express';
import type { ApiResponse } from '@openlog/shared';
import { getHealthStatus, type HealthStatus } from './health.service';

export function getHealth(_request: Request, response: Response<ApiResponse<HealthStatus>>): void {
  response.json({
    success: true,
    data: getHealthStatus(),
  });
}
