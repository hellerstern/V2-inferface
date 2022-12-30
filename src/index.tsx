import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RainbowKitProvider, Theme, connectorsForWallets, Chain, DisclaimerComponent } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  ledgerWallet,
  walletConnectWallet,
  argentWallet, braveWallet, imTokenWallet, omniWallet, rainbowWallet, trustWallet
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import './Rainbowkit.css';
import './index.css';
import 'react-toastify/dist/ReactToastify.min.css';
import './toast.css';

// eslint-disable-next-line @typescript-eslint/no-var-requires
window.Buffer = require('buffer').Buffer;

const arbitrum: Chain = {
  id: 42161,
  name: "Arbitrum",
  network: "arbitrum",
  iconUrl : "https://i.ibb.co/XCxK6J6/arb.png",
  iconBackground: 'rgba(0,0,0,0)',
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://arb1.arbitrum.io/rpc"]
    }
  },
  blockExplorers: {
    etherscan: { name: "Arbiscan", url: "https://arbiscan.io" },
    default: { name: "Arbiscan", url: "https://arbiscan.io" }
  }
};

const arbitrumTestnet: Chain = {
  id: 421613,
  name: 'Arbitrum Goerli',
  network: 'arbitrum-goerli',
  iconUrl: './assets/images/arbtest.png',
  iconBackground: 'rgba(0,0,0,0)',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: {
      http: ['https://goerli-rollup.arbitrum.io/rpc']
    }
  },
  blockExplorers: {
    default: { name: 'Arbiscan', url: 'https://goerli.arbiscan.io' },
    etherscan: { name: 'Arbiscan', url: 'https://goerli.arbiscan.io' }
  },
  testnet: true
};

const polygon = {
  id: 137,
  name: "Polygon",
  network: "matic",
  iconUrl: 'https://i.ibb.co/dQQJ8Xy/polygon.png',
  iconBackground: 'rgba(0,0,0,0)',
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://polygon-rpc.com"]
    }
  },
  blockExplorers: {
    etherscan: {
      name: "PolygonScan",
      url: "https://polygonscan.com"
    },
    default: {
      name: "PolygonScan",
      url: "https://polygonscan.com"
    }
  }
};

const { chains, provider } = configureChains(
  [polygon, arbitrum, arbitrumTestnet],
  [alchemyProvider({ apiKey: '6mDnh0_FqrDQzdcOCI_O5NkDs70x4VYp' }), publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Select your wallet',
    wallets: [
      metaMaskWallet({ chains }),
      trustWallet({ chains }),
      walletConnectWallet({ chains }),
      ledgerWallet({ chains }),
      braveWallet({ chains }),
      argentWallet({ chains }),
      imTokenWallet({ chains }),
      omniWallet({ chains }),
      rainbowWallet({ chains })
    ]
  }
]);

const wagmiClient = createClient({
  connectors,
  autoConnect: true,
  provider
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const TigrisTheme: Theme = {
  blurs: {
    modalOverlay: "none"
  },
  colors: {
    accentColor: "#17191D",
    accentColorForeground: "#FFFFFF",
    actionButtonBorder: "#363A44",
    actionButtonBorderMobile: "#000000",
    actionButtonSecondaryBackground: "#000000",
    closeButton: "#FFFFFF",
    closeButtonBackground: "#23262F",
    connectButtonBackground: "#17191D",
    connectButtonBackgroundError: "#17191D",
    connectButtonInnerBackground: "#17191D",
    connectButtonText: "#FFFFFF",
    connectButtonTextError: "#FFFFFF",
    connectionIndicator: "green",
    downloadBottomCardBackground: "#FFFFFF",
    downloadTopCardBackground: "#FFFFFF",
    error: "#FFFFFF",
    generalBorder: "#363A44",
    generalBorderDim: "#363A44",
    menuItemBackground: "#363A44",
    modalBackdrop: "rgba(0,0,0,0.5)",
    modalBackground: "#17191D",
    modalBorder: "#363A44",
    modalText: "#FFFFFF",
    modalTextDim: "#FFFFFF",
    modalTextSecondary: "#FFFFFF",
    profileAction: "#23262F",
    profileActionHover: "#363A44",
    profileForeground: "#17191D",
    selectedOptionBorder: "#363A44",
    standby: "#000000"
  },
  fonts: {
    body: "..."
  },
  radii: {
    actionButton: "...",
    connectButton: "...",
    menuButton: "...",
    modal: "...",
    modalMobile: "..."
  },
  shadows: {
    connectButton: "...",
    dialog: "...",
    profileDetailsAction: "...",
    selectedOption: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    selectedWallet: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    walletLogo: "..."
  }
};

interface DisclaimerProps {
  Text: any;
  Link: any;
}
const Disclaimer: DisclaimerComponent = ({ Text, Link }: DisclaimerProps) => (
  <Text>
    New to Tigris Trade?
    <Link href="https://docs.tigris.trade"> Click here to read Tigris Trade documentation.</Link>
  </Text>
);

root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={TigrisTheme}
        modalSize="compact"
        appInfo={{
          appName: 'Tigris Trade',
          disclaimer: Disclaimer
        }}
      >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
