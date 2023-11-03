import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AppBar, Container } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { makeStyles } from "@mui/styles";
import ConnectWallet from "./Connect";
import { ChainName } from "@cosmos-kit/core";

const Navbar = () => {
  const classes = useStyles();
  const [chainName, setChainName] = useState<ChainName>("injectivetestnet");

  // to toggle the menu
  const [openMenu, setOpenMenu] = useState(false);
  const menuItemContainerRef = useRef<any>(null);
  const toggleMenu = (state: any) => {
    state
      ? menuItemContainerRef.current.classList.add("open")
      : menuItemContainerRef.current.classList.remove("open");
    setOpenMenu(state);
  };

  return (
    <AppBar position="static" classes={{ root: classes.nav }}>
      <Container className={classes.container}>
        <div className={classes.flexContainer}>
          <Link style={{ display: "flex", alignItems: "center" }} to="/">
            <img src="/img/logo.png" alt="logo" className={classes.logo} />
            <h1 className={classes.title}>InterSwapX</h1>
          </Link>

          <div className={classes.rightSec}>
            <div
              className={classes.menuItemContainer}
              ref={menuItemContainerRef}
            >
              <Link to="/" className="menuItem">
                Home
              </Link>

              <Link to="/swap" className={"menuItem"}>
                Swap
              </Link>
            </div>

            <ConnectWallet chainName={chainName} />

            <MenuIcon
              className={classes.menuIcon}
              onClick={() => {
                openMenu ? toggleMenu(false) : toggleMenu(true);
              }}
            />
          </div>
        </div>
      </Container>
    </AppBar>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    margin: "auto",
    padding: "0",
    "@media (max-width:1120px)": {
      padding: "0 20px",
    },
    "@media (max-width:599px)": {
      padding: "0 15px",
    },
  },
  logo: {
    height: 60,
    marginRight: 10,
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#234c4d",
    "@media (max-width:599px)": {
      fontSize: "20px",
    },
  },
  nav: {
    height: "70px",
    position: "relative",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightSec: {
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    width: "100%",
    "@media (max-width:599px)": {
      justifyContent: "flex-end",
    },
  },
  menuItemContainer: {
    display: "flex",
    zIndex: 10,
    "@media (max-width:599px)": {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      backgroundColor: "#FAC6A5",
      width: "100%",
      top: "70px",
      left: 0,
      padding: 0,
      height: 0,
      overflow: "hidden",
      transition: "all 0.5s ease",
    },
    "&.open": {
      padding: "20px 0",
      height: "auto",
      transition: "all 0.5s ease",
    },
    "& .menuItem": {
      marginRight: "30px",
      fontSize: "16px",
      textDecoration: "none",
      lineHeight: "36px",
      fontWeight: 700,
      color: "#234c4d",
      "&.active": {
        color: "#234c4d",
        textDecoration: "overline",
      },
      "&:hover": {
        textDecoration: "underline",
      },
      "@media (max-width:599px)": {
        margin: 0,
        color: "#234c4d",
        textAlign: "center",
        lineHeight: "50px",
      },
    },
  },
  menuIcon: {
    display: "none !important",
    height: 38,
    width: 38,
    background: "#B0DAFF",
    color: "#234c4d",
    "@media (max-width:599px)": {
      marginLeft: "20px",
      display: "flex !important",
    },
  },
}));

export default Navbar;
