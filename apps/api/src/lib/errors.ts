export class AppError extends Error {
  constructor(
    message: string,
    readonly statusCode = 500,
    readonly code = 'INTERNAL_ERROR',
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class WordPressError extends AppError {
  constructor(
    message: string,
    details?: unknown,
    statusCode = 502,
    code = 'WORDPRESS_ERROR',
  ) {
    super(message, statusCode, code, details);
    this.name = 'WordPressError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'El servicio de contenido no esta configurado') {
    super(message, 503, 'SERVICE_UNAVAILABLE');
    this.name = 'ServiceUnavailableError';
  }
}
