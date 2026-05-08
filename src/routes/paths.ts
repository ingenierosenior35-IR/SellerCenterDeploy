// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  HOME: '/home',
  DASHBOARD: '/dashboard',
  ACCOUNT: '/account',
  PRODUCT: '/product',
  ORDER: '/order',
  ACADEMY: '/academy',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    signIn: `${ROOTS.AUTH}/sign-in`,
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: { signIn: `${ROOTS.AUTH}/auth0/sign-in` },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // HOME
  home: {
    root: ROOTS.HOME,
    product: {
      root: `${ROOTS.HOME}/product`,
    },
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
  product: {
    root: ROOTS.PRODUCT,
    create: `${ROOTS.PRODUCT}/create`,
    createConfigurable: `${ROOTS.PRODUCT}/create/configurable`,
    load: `${ROOTS.PRODUCT}/load`,
    uploadList: `${ROOTS.PRODUCT}/load/list`,
    details: (id: number | string) => `${ROOTS.PRODUCT}/${id}`,
  },
  order: {
    root: ROOTS.ORDER,
    load: `${ROOTS.ORDER}/load`,
    details: (id: string) => `${ROOTS.ORDER}/${id}`,
  },
  clients: {
    root: '/clients',
  },
  return: {
    root: '/return',
    details: (id: number) => `/return/${id}`,
  },
  feedback: {
    root: '/feedback',
  },
  academy: {
    root: ROOTS.ACADEMY,
    course: (courseId: string) => `${ROOTS.ACADEMY}/${courseId}`,
    lesson: (courseId: string, lessonId: string) =>
      `${ROOTS.ACADEMY}/${courseId}/lesson/${lessonId}`,
  },
  account: {
    root: '/account',
    subaccount: {
      root: '/account/subaccount',
      details: (id: number) => `/account/subaccount/${id}`,
      edit: (id: number) => `/account/subaccount/${id}/edit`,
      new: '/account/subaccount/new',
    },
  },
  settings: '/settings',
  createSellers: '/create-sellers',
};
