import { ToastContainer, Slide } from 'react-toastify';

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
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        theme="dark"
        transition={Slide}
        toastStyle={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
      />
      <Footer />
    </>
  );
};
