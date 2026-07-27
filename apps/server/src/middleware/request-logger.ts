import morgan from 'morgan';

export const requestLogger = morgan((tokens, request, response) => {
  const method = tokens.method(request, response) ?? 'UNKNOWN';
  const status = tokens.status(request, response) ?? '-';
  const responseTime = tokens['response-time'](request, response) ?? '-';
  const path = new URL(request.url ?? '/', 'http://openlog.local').pathname;

  return `${method} ${path} ${status} ${responseTime} ms`;
});
