import React from "react";
import { Container, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { GitHub } from "@mui/icons-material";

const Team = () => {
  const classes = useStyles();

  return (
    <section className={classes.details}>
      <div className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <h1 className={classes.title}>
              Team
            </h1>
            <div className={classes.text}>
              I am an engineer, who has experience in designing and
              developing decentralised applications.
            </div>
            <div className={classes.text}>
              I worked on a variety of projects.
            </div>
          </Grid>

          <Grid item xs={12} sm={6}>
            <div className={classes.graphicContainer}>
              <div className={classes.team}>
                <img
                  src="https://github.com/fuzious.png"
                  alt="graphic"
                  className={classes.teamImg}
                />
                <div className={classes.name}>Shivam Agarwal</div>
                <div className={classes.subname}>Quant @WorldQuant</div>
              </div>
              {/* <div className={classes.team}>
                <img
                  src="https://github.com/dixitaniket.png"
                  alt="graphic"
                  className={classes.teamImg}
                />
                <div className={classes.name}>Aniket Dixit</div>
                <div className={classes.subname}>SDE @Umee</div>
              </div> */}
              {/* <div className={classes.team}>
                <img
                  src="https://github.com/amanraj1608.png"
                  alt="graphic"
                  className={classes.teamImg}
                />
                <div className={classes.name}>Aman Raj</div>
                <div className={classes.subname}>SDE @Biconomy</div>
              </div> */}
            </div>
          </Grid>
        </Grid>

        <div className={classes.btnCont}>
          <button
            className={classes.btn}
            onClick={() =>
              window.open("https://github.com/ShivamAgarwal-code", "_blank")
            }
          >
            <GitHub className={classes.logo} />
            Shivam
          </button>
        </div>
      </div>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  details: {
    padding: "60px 10px",
    position: "relative",
    margin: "0 auto",
    background: `url(/backgrounds/bg-art.png)`,
    "@media (max-width:959px)": {
      padding: "0 10px",
      paddingBottom: "60px",
    },
  },
  container: {
    maxWidth: 1080,
    margin: "0 auto",
    padding: 40,
    backgroundColor: "#FEF2F4",
    borderRadius: 25,
    border: "1.5px solid #6599dc",
    "@media (max-width:959px)": {
      paddingBottom: 100,
    },
  },
  title: {
    marginBottom: 20,
    fontSize: 40,
    fontFamily: "Asul, sans-serif",
    fontWeight: 600,
    // color: "#48360C",
  },
  text: {
    fontSize: 18,
    fontWeight: "400",
    // color: "#48360c",
    marginBottom: 20,
  },
  graphicContainer: {
    minHeight: 320,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,

    "@media (max-width:959px)": {
      flexDirection: "column",
    },
  },
  team: {
    textAlign: "center",
  },
  teamImg: {
    width: 120,
  },
  name: {
    fontSize: 14,
  },
  subname: {
    marginTop: 10,
    fontSize: 12,
  },
  graphic: {
    width: 130,
    "@media (max-width:959px)": {
      float: "none",
    },
    "@media (max-width:599px)": {
      display: "block",
      margin: "auto",
    },
    "@media (max-width:340px)": {
      display: "block",
      margin: "auto",
    },
  },
  btnCont: {
    clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 80%)",
    backgroundColor: "#A6C4EB",
    borderRadius: 24,
    maxWidth: 450,
    width: "80%",
    height: 100,
    display: "flex",
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    justifyContent: "center",
  },
  btn: {
    background: "#234C4D",
    cursor: "pointer",
    border: 0,
    outline: "none",
    boxShadow: "5px 5px 0px #6599dc",
    height: 40,
    lineHeight: "36px",
    padding: "18px 8px",
    display: "flex",
    alignItems: "center",
    color: "white",
    margin: "auto",
    "@media (max-width:599px)": {
      padding: 10,
    },
    "&:hover": {
      backgroundColor: "#000",
    },
  },
  logo: {
    height: 20,
    marginRight: 10,
  },
}));

export default Team;
