import React from "react";
import { Container, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const Roadmap = () => {
  const classes = useStyles();

  return (
    <section className={classes.details}>
      <div className={classes.container}>
        <h1 className={classes.title}>Roadmap</h1>

        <div className={classes.roadmap}>
          <img src="img/tree.svg" alt="Roadmap" className={classes.treeLogo} />
          <div className={classes.text}>(Q2 2023)</div>
          <div className={classes.oneBlock}>
            <div className={classes.subText}>
              Improving the SDK for better routes and prices.
            </div>
          </div>

          <div className={classes.text}>FUTURE...</div>
          <div className={classes.oneBlock}>
            <div className={classes.subText}>
              Introduce multihops for multiple chains using ICS-999
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  details: {
    margin: "0 auto",
    paddingBottom: "60px",
    position: "relative",
    overflow: "hidden",
    background: `url(/img/background.svg)`,
    "@media (max-width:959px)": {
      padding: "0 10px",
      paddingBottom: "120px",
    },
  },
  container: {
    maxWidth: "600px !important",
    margin: "0 auto",
    padding: "10px 0",
    borderRadius: 25,
    textAlign: "center",
    position: "relative",
    "@media (max-width:959px)": {
      padding: "10px",
    },
  },
  title: {
    marginBottom: 80,
    fontSize: 30,
    color: "#48360C",
  },
  text: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "left",
    margin: "25px auto 10px auto",
    color: "#48360c",
  },
  roadmap: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    position: "relative",
  },
  treeLogo: {
    position: "absolute",
    left: "-8%",
    top: "-10%",
    "@media (max-width:659px)": {
      left: "-22%",
      top: "-12%",
    },
  },
  oneBlock: {
    width: "100%",
    height: 220,
    padding: "50px 0 0 25%",
    backgroundColor: "#FFCE32",
    borderRadius: 30,
    boxShadow: "8px 8px 0px #DAA719",
    "@media (max-width:659px)": {
      padding: "20px 0 0 25%",
    },
  },
  subText: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "left",
    margin: "25px auto 10px auto",
    color: "#48360c",
  },
}));

export default Roadmap;
