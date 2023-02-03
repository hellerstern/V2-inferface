import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRIVATE_ROUTES } from 'src/config/routes';
import { TabPanel } from '../../src/components/TabPanel';
import { useStore } from '../../src/context/StoreContext';
import { Governance } from './Governance';
import { Referral } from './Referral';
import { Trade } from './Trade';
import { Vault } from './Vault';
import Cookies from 'universal-cookie';

export const Home = () => {
  const { page } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const cookies = new Cookies();
  useEffect(() => {
    const currentUrl = location.search;
    const params = new URLSearchParams(currentUrl);
    const refCode = params.get('ref');
    if (refCode != null && refCode !== undefined) {
      fetch(`${PRIVATE_ROUTES.serverUrl}/${refCode}`).then((response) => {
        response.json().then((data) => {
          navigate('/');
          const sender = data.toString();
          console.log({ sender });
          cookies.set('sender', sender);
        });
      });
    }
  }, []);
  return (
    <>
      <TabPanel value={page} index={0}>
        <Trade />
      </TabPanel>
      <TabPanel value={page} index={1}>
        <Vault />
      </TabPanel>
      <TabPanel value={page} index={2}>
        <Governance />
      </TabPanel>
      <TabPanel value={page} index={3}>
        <Referral />
      </TabPanel>
    </>
  );
};
