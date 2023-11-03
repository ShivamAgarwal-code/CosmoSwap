import { Container, Typography, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";

const Why = () => {
  const classes = useStyles();

  return (
    <section className={classes.details}>
      <Container className={classes.container}>
        <Grid container>
          <Grid item xs={12} sm={7}>
            <img src="img/main.png" alt="graphic" className={classes.graphic} />
          </Grid>

          <Grid item xs={12} sm={5} padding={2}>
            <Typography variant="h1" className={classes.title}>
              Cosmo X Swap
            </Typography>
            <br />
            <div className={classes.text}>
              Why use one exchange, when you can use them all?
            </div>
            <div className={classes.text}>
              CosmoSwap aggregates all the offers from various liquidity
              sources and merges them into one trade, so you save time and money
            </div>

            <div className={classes.text}>
              Our mission is to drive DeFi participation to new heights by
              offering secure, intelligent and optimized trading solutions for
              individuals and institutional traders to tap effortlessly into the
              fragmented liquidity pools.
            </div>

            <Link to="/swap" style={{ width: "max-content", display: "block" }}>
              <button className={classes.btnCont}>
                <img src="img/logo.png" alt="logo" className={classes.logo} />
                Start Now →
              </button>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
};

const useStyles = makeStyles(() => ({
  details: {
    padding: "60px 10px",
    position: "relative",
    overflow: "hidden",
    margin: "0 auto",
    background: `url(/img/background.svg)`,
    "@media (max-width:959px)": {
      padding: "0 10px",
      paddingBottom: "20px",
    },
  },
  container: {
    margin: "0 auto",
    display: "flex",
    maxWidth: 1080,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: "20px 0",
    fontSize: 26,
  },
  text: {
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 10,
  },
  logo: {
    height: 30,
    marginRight: 10,
  },
  btnCont: {
    backgroundColor: "#A6C4EB",
    borderRadius: 10,
    marginTop: 30,
    padding: 10,
    width: "max-content",
    height: 50,
    display: "flex",
    justifyContent: "center",
    boxShadow: "4px 4px 1px #6599dc",
    cursor: "pointer",
    border: 1,
    lineHeight: "36px",
    alignItems: "center",
    color: "black",
    fontSize: 20,
    "@media (max-width:599px)": {
      padding: 10,
    },
    "&:hover": {
      boxShadow: "none",
    },
  },
  graphic: {
    width: "80%",
    // maxHeight: 500,
    borderRadius: 10,
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
}));

export default Why;
