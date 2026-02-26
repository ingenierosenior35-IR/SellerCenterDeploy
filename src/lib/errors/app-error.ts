import type { ErrorCode } from "./error-codes";

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public status?: number
  ) {
    super(code);
  }
}
