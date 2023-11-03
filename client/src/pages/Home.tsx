import { makeStyles } from "@mui/styles";
import { ToastContainer } from "react-toastify";

import Navbar from "@/components/Navbar";
import Intro from "@/components/Home/Intro";
import Team from "@/components/Home/Team";
import Why from "@/components/Home/Why";
import Roadmap from "@/components/Home/Roadmap";
import Footer from "@/components/Footer";

const Home = () => {
  const classes = useStyles();

  return (
    <div className={classes.bgCover}>
      <Navbar />
      <Intro />
      <Why />
      <Team />
      <Roadmap />
      <Footer />
      <ToastContainer position="bottom-left" newestOnTop theme="dark" />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  bgCover: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    background: "linear-gradient(to bottom, #AEE0E1, #fff)",
    backgroundColor: "#AEE0E1",
  },
}));

export default Home;
