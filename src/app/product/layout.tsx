import { MainLayout } from 'src/layouts/main/index';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <MainLayout>{children}</MainLayout>;
}
