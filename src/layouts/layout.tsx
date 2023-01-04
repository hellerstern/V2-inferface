import { ToastContainer, Slide } from 'react-toastify';

import { Header } from './header';
import { Footer } from './footer';
import { styled } from '@mui/system';
import { Box } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <Wrapper>{children}</Wrapper>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        theme="dark"
        transition={Slide}
        toastStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      />
      <Footer />
    </>
  );
};

const Wrapper = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 110px)'
}));
