import { CONFIG } from 'src/global-config';
import { HomeLayout } from 'src/layouts/home/layout';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  if (CONFIG.auth.skip) {
    return <HomeLayout>{children}</HomeLayout>;
  }

  return (
    <AuthGuard>
      <HomeLayout>{children}</HomeLayout>
    </AuthGuard>
  );
}
