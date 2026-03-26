import { gql } from 'graphql-request';

export const GET_CUSTOMER = gql`
  query {
    customer {
      firstname
      lastname
      email
      identificationNumber: custom_attributes(attributeCodes: "numero_identificacion_usuario") {
        code
        ... on AttributeValue {
          value
        }
      }
      identificationType: custom_attributes(attributeCodes: "tipo_identificacion_usuario") {
        code
        ... on AttributeValue {
          value
        }
      }
      addresses {
        id
        firstname
        lastname
        street
        city
        region {
          region_id
          region_code
        }
        telephone
        default_billing
        default_shipping
      }
    }
  }
`;
