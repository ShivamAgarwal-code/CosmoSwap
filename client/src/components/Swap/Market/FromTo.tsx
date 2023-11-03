import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { CircularProgress, Grid } from "@mui/material";
import { useChain } from "@cosmos-kit/react";
import { MsgExecuteContractCompat } from "@injectivelabs/sdk-ts";
import { Network } from "@injectivelabs/networks";
import { MsgBroadcaster, WalletStrategy } from "@injectivelabs/wallet-ts";
import { Web3Exception } from "@injectivelabs/exceptions";

import TokenInputFrom from "../TokenInputFrom";
import TokenInputTo from "../TokenInputTo";
import SwitchIcon from "../../UI/SwitchIcon";
import ErrorBox from "../../UI/ErrorBox";
import SuccessBox from "../../UI/SuccessBox";
import { showErrorMessage, showSuccessMessage } from "@/util";
import { ChainId } from "@injectivelabs/ts-types";

type Tokens = {
  name: string;
  id: string;
  logo: string;
  price: string;
  balance: string;
};

type FromToType = {
  from: Tokens;
  to: Tokens;
  toggle: () => void;
  toggleForm: boolean;
  setFrom: React.Dispatch<React.SetStateAction<Tokens>>;
  setTo: React.Dispatch<React.SetStateAction<Tokens>>;
  setToggleForm: React.Dispatch<React.SetStateAction<boolean>>;
};

const NETWORK = Network.TestnetK8s;
const walletStrategy = new WalletStrategy({
  chainId: ChainId.Testnet,
});

export const getAddresses = async (): Promise<string[]> => {
  const addresses = await walletStrategy.getAddresses();
  if (addresses.length === 0) {
    throw new Web3Exception(
      new Error("There are no addresses linked in this wallet.")
    );
  }
  return addresses;
};

const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy,
  network: NETWORK,
});

const FromTo = ({
  toggleForm,
  setToggleForm,
  toggle,
  setFrom,
  setTo,
  from,
  to,
}: FromToType) => {
  const classes = useStyles();
  const { address, getSigningCosmWasmClient } = useChain("injectivetestnet");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loader2, setLoader2] = useState(false);

  console.log(parseFloat(from.price));
  console.log((parseFloat(from.price) / parseFloat(to.price)).toString());

  const swap = async (event: any) => {
    event.preventDefault();
    if (!address) {
      setError("Please connect wallet");
      return;
    }
    try {
      setLoading(true);
      setError("");
      // allowance increase token1
      const client = await getSigningCosmWasmClient();
      console.log(client.signAndBroadcast);

      const msg = MsgExecuteContractCompat.fromJSON({
        contractAddress: "inj180em25mkkmt73f7v3x3zphzhetn3q8nfy6qy55",
        sender: address,
        msg: {
          call_swaps: {
            msg: {
              call_swaps: {
                swap_calls: [
                  {
                    contract_address:
                      "inj180em25mkkmt73f7v3x3zphzhetn3q8nfy6qy55",
                    swap_binary: "",
                    start_index: 0,
                    chain_id: "osmosis",
                    osmo_call: {
                      contract_address:
                        "inj180em25mkkmt73f7v3x3zphzhetn3q8nfy6qy55",
                      TRANSFER_PORT: "transfer",
                      TRANSFER_CHANNEL: "channel-60",
                      memo: "",
                      funds: [
                        {
                          denom: "inj",
                          amount: "100000",
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      });
      // Signing and broadcasting the message
      const tx = await msgBroadcastClient.broadcast({
        msgs: msg,
        injectiveAddress: address,
      });
      console.log(tx);
      showSuccessMessage(
        `Transaction success, Click to verify on explorer`,
        tx.txHash
      );
      setLoading(false);

      setLoader2(true);
      // listen to webhook to get the tx hash of relayer
      setLoader2(false);
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
      showErrorMessage("Insufficient liquidity on dex");
      console.error(e);
    }
  };

  return (
    <form className={"classes.formContainer"} onSubmit={swap}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h3 className={classes.inputTitle}>You Pay</h3>
          <div className={classes.inputSection}>
            <TokenInputFrom
              token={from}
              value={amount}
              setFrom={setFrom}
              onChange={(e: any) => setAmount(e.target.value)}
            />
          </div>
        </Grid>

        <SwitchIcon
          toggleForm={toggleForm}
          toggle={toggle}
          setToggleForm={setToggleForm}
        />

        <Grid item xs={12}>
          <h3 className={classes.inputTitle}>You Receive</h3>
          <div className={classes.inputSection}>
            <TokenInputTo
              token={to}
              value={(parseFloat(amount) * 0.5).toFixed(2)}
              setTo={setTo}
            />
          </div>
        </Grid>
      </Grid>

      {error && <ErrorBox message={error} />}
      {loader2 && (
        <div style={{ position: "relative", padding: "30px 0 0 50px" }}>
          <CircularProgress className={`${classes.loading2}`} size={24} />
          <p style={{ marginLeft: 40 }}>Waiting for relayer</p>
        </div>
      )}
      {txHash && <SuccessBox message={txHash} />}

      <button type="submit" className={classes.button} disabled={loading}>
        {loading && (
          <CircularProgress className={`${classes.loading}`} size={24} />
        )}
        Swap Token
      </button>
    </form>
  );
};

const useStyles = makeStyles(() => ({
  button: {
    position: "relative",
    height: "56px",
    width: "100%",
    marginTop: 24,
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 22,
    fontFamily: "Roboto",
    backgroundColor: "#0D121C",
    backgroundImage:
      "linear-gradient(to right, #348F50 0%, #56B4D3  51%, #348F50  100%)",
    boxShadow: "0 0 20px #eee",
    border: "none",
    padding: "5px 45px",
    backgroundSize: "200% auto",
    transition: "0.5s",
    color: "#fff",

    "&:hover": {
      backgroundPosition: "right center",
      color: "#fff",
      textDecoration: "none",
      opacity: "0.8",
    },
  },
  inputSection: {
    backgroundColor: "#0D121C",
    borderRadius: "6px",
    overflow: "hidden",
  },
  inputTitle: {
    fontSize: 16,
    margin: "0 0 8px 0",
    paddingLeft: "2px",
    fontWeight: 400,
  },
  progressBar: {
    borderRadius: "5px",
    marginTop: "20px",
  },
  loading: {
    position: "absolute",
    display: "block",
    margin: "auto",
    left: "-55%",
    right: 0,
    top: 15,
  },
  loading2: {
    position: "absolute",
    display: "block",
    margin: "auto",
  },
}));

export default FromTo;
