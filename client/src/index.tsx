import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { SignerOptions } from "@cosmos-kit/core";
import { chains, assets } from "chain-registry";
import theme from "./theme";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const signerOptions: SignerOptions = {};

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChainProvider
        chains={chains}
        assetLists={assets}
        wallets={[...keplrWallets, ...cosmostationWallets, ...leapWallets]}
        walletConnectOptions={{
          signClient: {
            projectId: "e3dbf2000df67d6ebf6b755d8a018c86",
            relayUrl: "wss://relay.walletconnect.org",
            metadata: {
              name: "CosmoSwap",
              description: "Aggregator for Cosmos ecosystem",
              url: "https://portfolio-shivam-agarwal-dfbwjc.spheron.app/",
              icons: [],
            },
          },
        }}
        wrappedWithChakra={true}
        signerOptions={signerOptions}
      >
        <App />
      </ChainProvider>
    </ThemeProvider>
  </React.StrictMode>
);
