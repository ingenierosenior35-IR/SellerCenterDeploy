import { ErrorCode } from "./error-codes";

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_CREDENTIALS]:
    "Ocurrió un problema al iniciar sesión. Inténtalo nuevamente.",

  [ErrorCode.UNEXPECTED_ERROR]:
    "Ocurrió un problema. Inténtalo nuevamente.",

  [ErrorCode.NETWORK_ERROR]:
    "No pudimos conectarnos al servidor. Verifica tu conexión.",
};
