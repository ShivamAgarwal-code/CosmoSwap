import { makeStyles } from "@mui/styles";
import { Twitter, GitHub } from "@mui/icons-material";

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px 20px",
          maxWidth: 1280,
          margin: "auto",
        }}
      >
        <div>
          <p className={classes.text}>Copyright © 2023, Shivam Agarwal.</p>
        </div>
        <div className={classes.smIconsContainer}>
          <a
            href="https://twitter.com/shiv2002Agarwal"
            target="_blank"
            rel="noreferrer"
          >
            <div className={classes.smIcon}>
              <Twitter style={{ fontSize: "26px" }} />
            </div>
          </a>
          <a
            href="https://github.com/ShivamAgarwal-code/CosmoSwap.git"
            target="_blank"
            rel="noreferrer"
          >
            <div className={classes.smIcon}>
              <GitHub style={{ fontSize: "26px" }} />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme,
  footer: {
    position: "relative",
    borderTop: "1px solid white",
    display: "block",
    padding: "50px 0",
    backgroundColor: "#271F58",
  },
  logo: {
    height: "40px",
    margin: "auto",
  },
  text: {
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    maxWidth: "360px",
    marginBottom: 0,
    marginTop: "20px",
  },
  smIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "6px",
    backgroundColor: "#576CBC",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    transition: "0.1s ease",
    "&:first-child": {
      marginRight: "20px",
    },

    "&:hover": {
      backgroundColor: "white",
      color: "#8247E5",

      "& svg": {
        fill: "black",
      },
    },

    "& svg": {
      fill: "#fff",
      width: "30px",
    },

    "@media (max-width:599px)": {
      marginTop: "30px",
    },
  },
  smIconsContainer: {
    display: "flex",
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    "@media (max-width:599px)": {
      justifyContent: "flex-start",
    },
  },
}));

export default Footer;
