import React, { createContext, useState, useContext, useEffect } from 'react';
import { localStorageGet, localStorageSet } from '../utils/localStorage';

interface StoreContextProps {
  page: number;
  setPage: (value: number) => void;
  miniPage: number;
  setMiniPage: (value: number) => void;
}

interface propsType {
  children: React.ReactNode;
}

const StoreContext = createContext<StoreContextProps | null>(null);

const StoreProvider = (props: propsType) => {
  const [page, setPage] = useState<number>(localStorageGet('page'));
  const [miniPage, setMiniPage] = useState<number>(localStorageGet('miniPage'));

  const loadPage = () => {
    setPage(localStorageGet('page') === '' ? 0 : localStorageGet('page'));
    setMiniPage(localStorageGet('miniPage') === '' ? 0 : localStorageGet('miniPage'));
  };

  const setPageNumber = (num: number) => {
    setPage(num);
    localStorageSet('page', num);
  };

  const setMiniPageNumber = (num: number) => {
    setMiniPage(num);
    localStorageSet('miniPage', num);
  };

  useEffect(() => {
    loadPage();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        page,
        setPage: setPageNumber,
        miniPage,
        setMiniPage: setMiniPageNumber
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === null) {
    throw new Error("can't find context");
  }
  return context;
};
