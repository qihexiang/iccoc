export default class HttpError extends Error {
  status: number;
  reason: string;
  constructor(status: number, reason: string, cause?: unknown) {
    super();
    this.status = status;
    this.reason = reason;
    this.cause = cause;
  }
}
