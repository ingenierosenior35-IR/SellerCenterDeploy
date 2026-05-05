'use client';

// Query crítica para autenticación: SOLO los campos imprescindibles para
// determinar si la sesión es válida. Mantenerla mínima evita que un campo
// nuevo o un cambio en el backend rompa el login (un error en cualquier
// otra parte del payload anula la respuesta completa).
//
// Para datos derivados (seller_profile, etc.), usar queries separadas en
// hooks dedicados — su fallo nunca debe sacar al usuario al login.
export const GET_CURRENT_USER_QUERY = `
  query GetCurrentUser {
    customer {
      email
      firstname
      lastname
    }
  }
`;

export const GET_SELLER_PROFILE_QUERY = `
  query GetSellerProfile {
    customer {
      seller_profile {
        seller_id
        seller_status
        seller_status_label
        shop_url
      }
    }
  }
`;
