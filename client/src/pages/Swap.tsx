import { makeStyles } from "@mui/styles";
import { ToastContainer } from "react-toastify";

import Navbar from "@/components/Navbar";
import FormSection from "@/components/Swap/FormSection";
import Footer from "@/components/Footer";

const Swap = () => {
  const classes = useStyles();

  return (
    <div className={classes.bgCover}>
      <div className={classes.bgImage}></div>
      <Navbar />
      <div style={{ borderTop: "2px solid #000" }}></div>
      <div className={classes.market}>
        <FormSection label="Transfer" />
      </div>
      <Footer />
      <ToastContainer position="bottom-left" newestOnTop theme="dark" />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  bgCover: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    backgroundColor: "#AEE0E1",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  bgImage: {
    position: "absolute",
    top: "71px",
    left: 0,
    width: "100%",
    height: "100%",
    background: `url(/backgrounds/northern-lights-bg.png)`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  market: {
    minHeight: "80vh",
    margin: "10px auto",
    display: "flex",
    gap: 20,
    justifyContent: "space-between",

    "@media (max-width: 1280px)": {
      padding: "0 20px",
    },
    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  },
}));

export default Swap;
