import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRIVATE_ROUTES } from 'src/config/routes';
import { TabPanel } from '../../src/components/TabPanel';
import { useStore } from '../../src/context/StoreContext';
import { Governance } from './Governance';
import { Referral } from './Referral';
import { Trade } from './Trade';
import { Vault } from './Vault';
import { oracleData, eu1oracleSocket } from 'src/context/socket';
import { getNetwork } from 'src/constants/networks';
import Cookies from 'universal-cookie';

export const Home = () => {
  const { page } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [data, setData] = useState<any>(oracleData);
  useEffect(() => {
    eu1oracleSocket.on('data', (data: any) => {
      setData(data);
    });
  }, []);
  useEffect(() => {
    const currentUrl = location.search;
    const params = new URLSearchParams(currentUrl);
    const refCode = params.get('ref');
    if (refCode != null && refCode !== undefined) {
      fetch(`${PRIVATE_ROUTES.referral_serverUrl}/${refCode}`).then((response) => {
        response.json().then((data) => {
          navigate('/');
          const sender = data.toString();
          console.log({ sender });
          cookies.set('sender', sender);
        });
      });
    }
  }, []);
  useEffect(() => {
		if(data === "Loading...") {
      document.title = "Trading | Tigris";
      return;
    }
    if(page === 0) {
      const currentNetwork = getNetwork(0);
      const pairIndex = parseInt(localStorage.getItem("LastPairSelected") ? localStorage.getItem("LastPairSelected") as string : "0");
      const pair = currentNetwork.assets[pairIndex].name;
      if (data[pairIndex]) {
        document.title = pair + " "+ (parseFloat(data[pairIndex].price)/1e18).toPrecision(6) +" | Tigris";
      } else {
        document.title = "Trading | Tigris";
      }
    } else if(page === 1) {
      document.title = "Vault | Tigris";
    } else if(page === 2) {
      document.title = "Governance | Tigris";
    } else if(page === 3) {
      document.title = "Referral | Tigris";
    }
	}, [data, page]);
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
