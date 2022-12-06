import { TabPanel } from 'src/components/TabPanel';
import { useStore } from 'src/context/StoreContext';

export const Home = () => {
  const { page } = useStore();
  return (
    <>
      <TabPanel value={page} index={0}>
        Trade
      </TabPanel>
      <TabPanel value={page} index={1}>
        Vault
      </TabPanel>
      <TabPanel value={page} index={2}>
        Gorvernance
      </TabPanel>
      <TabPanel value={page} index={3}>
        Referral
      </TabPanel>
    </>
  );
};
