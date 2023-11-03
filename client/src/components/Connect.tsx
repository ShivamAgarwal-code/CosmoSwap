// @ts-ignore
import Blockies from "react-blockies";
import { makeStyles } from "@mui/styles";
import { useChain } from "@cosmos-kit/react";
import { truncateAddress } from "@/util";

const ConnectWallet = ({ chainName }: any) => {
  const classes = useStyles();
  const { connect, openView, address } = useChain(chainName || "");

  return (
    <div className={classes.walletBtnContainer}>
      <button
        className={classes.walletBtn}
        onClick={address ? openView : connect}
      >
        <Blockies
          className={`${classes.img} ${address ? "green" : "red"}`}
          seed={address ? address : ""}
        />
        <div style={{ fontFamily: "Roboto", fontWeight: 700 }}>
          {address ? truncateAddress(address) : "Connect Wallet"}
        </div>
      </button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  walletBtnContainer: {
    display: "flex",
    position: "relative",
  },
  walletBtn: {
    background: "#C7E9B0",
    cursor: "pointer",
    color: "#234c4d",
    border: 0,
    outline: "none",
    borderRadius: "18px",
    height: "36px",
    lineHeight: "36px",
    padding: "0 18px 0 8px",
    display: "flex",
    alignItems: "center",

    "@media (max-width:599px)": {
      padding: 0,
    },

    "&:hover": {
      backgroundColor: "#B3C99C",
    },

    "& div": {
      "@media (max-width:599px)": {
        margin: 0,
        display: "none",
      },
    },
  },
  img: {
    borderRadius: "12px",
    marginRight: 5,
    height: "24px !important",
    width: "24px !important",

    "&.green": {
      borderColor: "green",
    },

    "&.red": {
      borderColor: "red",
    },

    "@media (max-width:599px)": {
      marginRight: 0,
      height: "36px !important",
      width: "36px !important",
      borderRadius: "20px",
      border: "2px solid",
    },
  },
}));

export default ConnectWallet;
