interface GraphQLErrorExtensions {
  category: string;
}

interface ErrorInterface {
  message: string;
  path: string[];
  extensions: GraphQLErrorExtensions;
}

export interface GraphQLErrorResponseInterface {
  errors: ErrorInterface[];
}
