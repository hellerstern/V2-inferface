import { ToastContainer } from 'react-toastify';

import { Header } from './header';
import { Footer } from './footer';
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="light"
      />
      <Footer />
    </>
  );
};
