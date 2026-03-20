// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  HOME: '/home',
  PRODUCT: '/product',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    signIn: `${ROOTS.AUTH}/sign-in`,
    signUp: `${ROOTS.AUTH}/sign-up`,
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: { signIn: `${ROOTS.AUTH}/auth0/sign-in` },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
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
  product: {
    root: ROOTS.PRODUCT,
    load: `${ROOTS.PRODUCT}/load`,
    uploadList: `${ROOTS.PRODUCT}/load/list`,
    details: (id: number) => `${ROOTS.PRODUCT}/${id}`,
  },
  return: {
    root: '/return',
    details: (id: number) => `/return/${id}`,
  },
  feedback: {
    root: '/feedback',
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
};
