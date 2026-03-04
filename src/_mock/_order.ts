import type { ReturnListInterface } from 'src/interfaces';
import type { CustomerInterface } from 'src/interfaces/customer.interface';

import { _mock } from './_mock';

// ----------------------------------------------------------------------


export const _myid = Array.from(
  { length: 40 },
  (_, index) => +`99097884951818027${index + 1}`
);

export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

const ITEMS = Array.from({ length: 3 }, (_, index) => ({
  id: +_mock.id(index),
  // sku: `16H9UR${index}`,
  quantity: index + 1,
  name: _mock.productName(index),
  coverUrl: _mock.image.product(index),
  price: _mock.number.price(index),
  thumbnail: _mock.image.product(index),
}));

export const _returns: ReturnListInterface[] = Array.from({ length: 20 }, (_, index) => {
  const productsOrder = (index % 2 && ITEMS.slice(0, 1)) || (index % 3 && ITEMS.slice(1, 3)) || ITEMS;

  const customer: CustomerInterface = {
    id: _myid[index],
    name: _mock.fullName(index),
    email: _mock.email(index),
    phoneNumber: _mock.phoneNumber(index),
    firstname: _mock.firstName(index),
    lastname: _mock.lastName(index),
    avatarUrl: _mock.image.avatar(index),
  };

  return {
    id: _myid[index],
    orderReference: `#601${index}`,
    createdAt: _mock.time(index),
    productsOrder,
    customer,
    status:
      (index % 2 && 'completed') ||
      (index % 3 && 'pending') ||
      (index % 4 && 'cancelled') ||
      'refunded',
  };
});
