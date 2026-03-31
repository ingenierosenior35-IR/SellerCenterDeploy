'use client';


export type StatusColor = 'warning' | 'success' | 'error';

export type TableHeadCell = {
  id: string;
  label?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  sx?: object | object[];
};

export const STATUS_COLORS: Record<string, StatusColor> = {
  'Pago por confirmar': 'warning',
  'Orden en Proceso': 'warning',
  'Entrega Parcial': 'warning',
  'Orden Confirmada': 'success',
  'Entregado': 'success',
  'Completo': 'success',
  'Cancelado': 'error',
  'Devuelto': 'error',
};

export const TABLE_ORDER_HEAD: TableHeadCell[] = [
  { id: 'orderNumber', label: 'Orden', width: 88 },
  { id: 'name', label: 'Cliente' },
  { id: 'createdAt', label: 'Fecha', width: 140 },
  { id: 'totalQuantity', label: 'Cantidad', width: 88, align: 'center' },
  { id: 'totalAmount', label: 'Total', width: 140 },
  { id: 'status', label: 'Estado', width: 110 },
  { id: '', width: 40 },
];

export const STATUS_WITHOUT_GUIDES: string[] = [
  'Pago por confirmar',
  'Cancelado',
];
