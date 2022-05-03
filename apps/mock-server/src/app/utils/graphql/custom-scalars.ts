import { GraphQLScalarType, Kind } from 'graphql';

const numericScalars = (scalarName: string) => {
  return new GraphQLScalarType({
    name: scalarName,
    description: scalarName + ' custom scalar type',
    serialize(value) {
      return value; // Convert outgoing value for JSON
    },
    parseValue(value) {
      return +value; // Convert incoming value to Long
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return +ast.value; // Convert hard-coded AST string to integer and then to Date
      }
      return null; // Invalid hard-coded value (not an integer)
    },
  });
};

export const longScalar = numericScalars('Long');
export const bigIntScalar = numericScalars('Int64');
export const timestampScalar = numericScalars('Timestamp');
