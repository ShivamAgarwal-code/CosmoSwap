import { Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";

const Intro = () => {
  const classes = useStyles();

  return (
    <section className={classes.details}>
      <Container className={classes.container}>
        <h1 className={classes.title}>Trade all DEXs at once</h1>
        <div className={classes.text}>
          DeFi aggregator that unites the liquidity of decentralized exchanges
          into one comprehensive interface via ibc.
        </div>

        <Link
          to="/swap"
          className="menuItem"
          style={{ width: "max-content", display: "block", margin: "auto" }}
        >
          <button className={classes.btn}>
            <img src="img/logo.png" alt="logo" className={classes.logo} />
            <div>Start Trading →</div>
          </button>
        </Link>
      </Container>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  details: {
    padding: "20px 10px",
    position: "relative",
    overflow: "hidden",
    background: `url(/backgrounds/bg-art.png)`,
    "@media (max-width:959px)": {
      padding: "40px 10px",
      paddingBottom: "120px",
    },
  },
  container: {
    margin: "0 auto",
    padding: "10px 0",
    // backgroundColor: "#FEF2F4",
    borderRadius: 25,
    textAlign: "center",
    position: "relative",
    "@media (max-width:959px)": {
      padding: "10px",
    },
  },
  title: {
    margin: "10px 0",
    fontSize: 70,
    fontFamily: "'Cairo', sans-serif",
  },
  text: {
    fontSize: 18,
    maxWidth: 600,
    textAlign: "center",
    // backgroundColor: "#FEF2F4",
    borderRadius: 6,
    margin: "10px auto 30px auto",
  },
  graphicContainer: {
    width: "100%",
    margin: "50px 0 80px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  graphic: {
    width: "100%",
    margin: "0 auto",
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
  btn: {
    alignItems: "center",
    backfaceVisibility: "hidden",
    backgroundColor: "rgb(31, 31, 65)",
    fontSize: 30,
    backgroundImage: "none",
    borderRadius: 86,
    color: "rgb(255, 255, 255)",
    display: "flex",
    fontWeight: "bold",
    height: 80,
    justifyContent: "space-between",
    margin: "0px auto 30px",
    maxWidth: 366,
    paddingLeft: 28,
    paddingRight: 40,
    textAlign: "center",
    textDecoration: "none",
    transform: "translateZ(0px)",
    userSelect: "none",
    width: "100%",
    willChange: "transform",
    "@media (max-width:599px)": {
      padding: 10,
    },
    "&:hover": {
      backgroundColor: "#000",
    },
  },
  logo: {
    height: 50,
    marginRight: 10,
  },
}));

export default Intro;
