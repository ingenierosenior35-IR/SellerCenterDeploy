'use client';

import type { SubAccountInterface } from 'src/interfaces';

import { useMemo } from 'react';

export function useGetSubAccounts() {

 const accounts: SubAccountInterface[] = useMemo(() => [
    {
      id: 142,
      name: 'Ana garcia',
      email: 'ana@gmail.com',
      phone: '+57 310 555 0192',
      status: 'ACTIVE',
      createdAt: '2022-03-04',
      lastAccess: "2025-03-15T10:42:00Z",
      actions: ['editar', 'historial', 'suspender', 'eliminar'],
      permissions: ['REPORTS', 'ORDERS']
    },
    {
      id: 143,
      name: 'Juan Perez',
      email: 'juan.perez@gmail.com',
      phone: '+57 310 555 0193',
      status: 'INACTIVE',
      createdAt: '2022-04-05',
      lastAccess: "2025-04-16T11:42:00Z",
      actions: ['editar', 'historial', 'suspender', 'eliminar'],
      permissions: ['PRODUCTS', 'INVENTORY', 'ORDERS']
    },
    {
      id: 144,
      name: 'Juan Ruiz',
      email: 'juan.ruiz@gmail.com',
      phone: '+57 310 555 789',
      status: 'INACTIVE',
      createdAt: '2022-04-05',
      lastAccess: "2025-04-16T11:42:00Z",
      actions: ['editar', 'historial'],
      permissions: ['PRODUCTS', 'INVENTORY']
    },
  ], []);

  return { accounts, isLoading: false };
}
