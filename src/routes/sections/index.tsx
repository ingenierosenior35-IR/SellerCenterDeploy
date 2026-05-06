import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { HomeLayout } from 'src/layouts/home';

import { SplashScreen } from 'src/components/loading-screen';

import { AuthGuard , GuestGuard } from 'src/auth/guard';

// ---------------------------------------------------------------------- Views (lazy)

const OverviewAppView = lazy(() =>
  import('src/sections/overview/app/view').then((m) => ({ default: m.OverviewAppView }))
);
const DashboardSummaryView = lazy(() =>
  import('src/sections/dashboard/view').then((m) => ({ default: m.DashboardSummaryView }))
);

// Product
const ProductListView = lazy(() =>
  import('src/sections/product/view').then((m) => ({ default: m.ProductListView }))
);
const ProductCreateSimpleView = lazy(() =>
  import('src/sections/product/view').then((m) => ({ default: m.ProductCreateSimpleView }))
);
const ProductCreateConfigurableView = lazy(() =>
  import('src/sections/product/view').then((m) => ({ default: m.ProductCreateConfigurableView }))
);
const ProductLoadView = lazy(() =>
  import('src/sections/product/view/product-load-view').then((m) => ({
    default: m.ProductLoadView,
  }))
);
const LoadOptionsView = lazy(() =>
  import('src/sections/product/view/load-options-view').then((m) => ({ default: m.default }))
);
const ProductDetailsView = lazy(() =>
  import('src/sections/product/view').then((m) => ({ default: m.ProductDetailsView }))
);

// Order
const OrderListView = lazy(() =>
  import('src/sections/order/views/order-list-view').then((m) => ({ default: m.OrderListView }))
);
const OrderDetailsClient = lazy(() =>
  import('src/sections/order/order-details-client').then((m) => ({ default: m.default }))
);

// Clients
const ClientsView = lazy(() =>
  import('src/sections/clients/view/clients-view').then((m) => ({ default: m.default }))
);

// Return
const ReturnListView = lazy(() =>
  import('src/sections/return/view').then((m) => ({ default: m.ReturnListView }))
);

// Feedback
const FeedbackView = lazy(() =>
  import('src/sections/feedback/view/feedback-view').then((m) => ({ default: m.default }))
);

// Account
const UserProfileView = lazy(() =>
  import('src/sections/account/view').then((m) => ({ default: m.UserProfileView }))
);
const SubAccountListView = lazy(() =>
  import('src/sections/sub-account/view').then((m) => ({ default: m.SubAccountListView }))
);
const SubAccountDetailsView = lazy(() =>
  import('src/sections/sub-account/view').then((m) => ({ default: m.SubAccountDetailsView }))
);

// Settings
const SellerCenterSettingsView = lazy(() =>
  import('src/sections/settings/view/seller-center-settings-view').then((m) => ({
    default: m.SellerCenterSettingsView,
  }))
);

// Auth
const SignInView = lazy(() =>
  import('src/auth/view').then((m) => ({ default: m.SignInView }))
);

// Create sellers
const CreateSellersView = lazy(() =>
  import('src/sections/create-sellers/view').then((m) => ({ default: m.CreateSellersView }))
);

// Public
const LandingView = lazy(() =>
  import('src/sections/international-sellers/view/landing-view').then((m) => ({
    default: m.LandingView,
  }))
);

// Error
const NotFoundView = lazy(() =>
  import('src/sections/error').then((m) => ({ default: m.NotFoundView }))
);

// ---------------------------------------------------------------------- Param wrappers

function ProductDetailsPage() {
  const { id } = useParams() as { id?: string };
  const productId = id ? Number(id) : Number.NaN;
  if (!Number.isFinite(productId)) return <Navigate to="/404" replace />;
  return <ProductDetailsView id={productId} />;
}

function SubAccountDetailsPage() {
  const { id } = useParams() as { id?: string };
  const subAccountId = id ? Number(id) : Number.NaN;
  if (!Number.isFinite(subAccountId)) return <Navigate to="/404" replace />;
  return <SubAccountDetailsView id={subAccountId} />;
}

function OrderDetailsPage() {
  const { id } = useParams() as { id?: string };
  if (!id) return <Navigate to="/404" replace />;
  return <OrderDetailsClient orderId={id} />;
}

// ---------------------------------------------------------------------- Layout wrappers

function ProtectedLayout() {
  return CONFIG.auth.skip ? (
    <HomeLayout>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </HomeLayout>
  ) : (
    <AuthGuard>
      <HomeLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </HomeLayout>
    </AuthGuard>
  );
}

function CreateSellersLayout() {
  return (
    <GuestGuard>
      <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'common.black' }}>
        {/* Left · hero image */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            flex: 1,
            position: 'relative',
            backgroundImage: 'url(/assets/illustrations/Banner-Create-Seller.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box
            component="img"
            src="/assets/images/logo/logo-miti.svg"
            alt="Miti Miti"
            sx={{
              position: 'absolute',
              left: { xs: 16, md: 32 },
              bottom: { xs: 16, md: 32 },
              width: 96,
              height: 'auto',
            }}
          />
        </Box>

        {/* Right · form */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, md: 6 },
          }}
        >
          <Suspense fallback={<SplashScreen />}>
            <CreateSellersView />
          </Suspense>
        </Box>
      </Box>
    </GuestGuard>
  );
}

function AuthSignInLayout() {
  return (
    <GuestGuard>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'common.black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          position: 'relative',
        }}
      >
        <Box
          component="a"
          href="/"
          aria-label="Miti Miti"
          sx={{
            position: 'absolute',
            top: { xs: 12, md: 20 },
            left: { xs: 12, md: 20 },
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            zIndex: 1500,
          }}
        >
          <Box
            component="img"
            src="/assets/images/logo/logo-miti.svg"
            alt="Miti Miti"
            sx={{ width: { xs: 100, md: 120 }, height: 'auto', display: 'block' }}
          />
        </Box>
        <Paper
          elevation={1}
          sx={{
            width: '100%',
            maxWidth: 520,
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Suspense fallback={<SplashScreen />}>
            <SignInView />
          </Suspense>
        </Paper>
      </Box>
    </GuestGuard>
  );
}

// ---------------------------------------------------------------------- Route tree

export const routesSection = [
  // Root redirect
  {
    index: true,
    element: <Navigate to={CONFIG.auth.redirectPath} replace />,
  },

  // Public landing
  {
    path: 'international-sellers',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <LandingView />
      </Suspense>
    ),
  },

  // Auth
  {
    path: 'auth',
    children: [
      {
        path: 'sign-in',
        element: <AuthSignInLayout />,
      },
    ],
  },

  // Create sellers (public · multi-step onboarding)
  {
    path: 'create-sellers',
    element: <CreateSellersLayout />,
  },

  // Protected routes (AuthGuard + HomeLayout)
  {
    element: <ProtectedLayout />,
    children: [
      { path: 'home', element: <OverviewAppView /> },
      { path: 'dashboard', element: <DashboardSummaryView /> },

      // Product
      { path: 'product', element: <ProductListView /> },
      { path: 'product/create', element: <ProductCreateSimpleView /> },
      { path: 'product/create/configurable', element: <ProductCreateConfigurableView /> },
      { path: 'product/load', element: <ProductLoadView /> },
      { path: 'product/load/list', element: <LoadOptionsView /> },
      { path: 'product/:id', element: <ProductDetailsPage /> },

      // Order
      { path: 'order', element: <OrderListView /> },
      { path: 'order/:id', element: <OrderDetailsPage /> },

      // Clients
      { path: 'clients', element: <ClientsView /> },

      // Return
      { path: 'return', element: <ReturnListView /> },

      // Feedback
      { path: 'feedback', element: <FeedbackView /> },

      // Account
      { path: 'account', element: <UserProfileView /> },
      { path: 'account/subaccount', element: <SubAccountListView /> },
      { path: 'account/subaccount/:id', element: <SubAccountDetailsPage /> },

      // Settings
      { path: 'settings', element: <SellerCenterSettingsView /> },
    ],
  },

  // 404 — catch-all
  {
    path: '*',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <NotFoundView />
      </Suspense>
    ),
  },
];
