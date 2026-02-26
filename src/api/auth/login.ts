import { ClientError } from "graphql-request";

import { LOGIN_MUTATION } from "src/graphql";
import { AppError, ErrorCode, graphqlClient , ERROR_MESSAGES } from "src/lib";


export const loginService = async (email: string, password: string) => {
  try {
    const variables = { email, password };
    const response = await graphqlClient.request(LOGIN_MUTATION, variables);
    const accessToken = response.generateCustomerToken?.token;

    if (!accessToken) {
      throw new AppError(ErrorCode.UNEXPECTED_ERROR);
    }

    return { accessToken };
  } catch (error: unknown) {

    if (error instanceof ClientError) {
      const message =
        error.response.errors?.[0]?.message ||
        ERROR_MESSAGES[ErrorCode.UNEXPECTED_ERROR];

      throw new Error(message);
    }

    if (error instanceof Error) {
      if (error.message === 'No se recibió un token de acceso en la respuesta.') {
        throw new AppError(ErrorCode.UNEXPECTED_ERROR);
      }
    }

    throw new AppError(ErrorCode.UNEXPECTED_ERROR);
  }
}
