const HttpStatus = require('http-status-codes');

class APIError extends Error {

  constructor(...args) {
    super(...args);
    this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    this.code = 'API_ERROR';
    Error.captureStackTrace(this, APIError);
  }

}

class AuthorizationError extends APIError {

  constructor(...args) {
    super(...args);
    this.status = HttpStatus.UNAUTHORIZED;
    this.code = 'AUTHORIZATION_ERROR';
  }

}

class NotFoundError extends APIError {

  constructor() {
    super();
    this.status = HttpStatus.NOT_FOUND;
    this.code = 'NOT_FOUND_ERROR';
  }

}

class UsernameUnavailableError extends APIError {

  constructor() {
    super();
    this.status = HttpStatus.UNAUTHORIZED;
    this.code = 'USERNAME_UNAVAILABLE_ERROR';
  }

}

class EmailAlreadyRegisteredError extends APIError {

  constructor() {
    super();
    this.status = HttpStatus.UNAUTHORIZED;
    this.code = 'EMAIL_ALREADY_REGISTERED_ERROR';
  }

}

class MissingUploadError extends APIError {

  constructor(paramName) {
    super();
    this.status = HttpStatus.BAD_REQUEST;
    this.code = 'MISSING_UPLOAD_ERROR';
    this.field = paramName;
  }

}

class UnexpectedUploadError extends APIError {

  constructor(fieldName) {
    super();
    this.status = HttpStatus.BAD_REQUEST;
    this.code = 'UNEXPECTED_UPLOAD_ERROR';
    this.field = fieldName;
  }

}

module.exports = {
  APIError: APIError,
  AuthorizationError: AuthorizationError,
  NotFoundError: NotFoundError,
  UsernameUnavailableError: UsernameUnavailableError,
  EmailAlreadyRegisteredError: EmailAlreadyRegisteredError,
  MissingUploadError: MissingUploadError,
  UnexpectedUploadError: UnexpectedUploadError
};