import { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TabPanel, TabContext } from "@mui/lab";

import FromTo from "./Market/FromTo";

type IFormProps = {
  label: string;
};

const FormSection = ({ label }: IFormProps) => {
  const classes = useStyles();
  const [value, setValue] = useState<string>("1");
  const [toggleForm, setToggleForm] = useState(false);
  const [from, setFrom] = useState(tokens[2]);
  const [to, setTo] = useState(tokens[0]);

  const toggle = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleTabs = (event: any, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={classes.formSection}>
      <div className={classes.outerFormContainer}>
        <TabContext value={value}>
          <Tabs
            value={value}
            onChange={handleTabs}
            className={classes.tabBar}
            indicatorColor="primary"
            TabIndicatorProps={{ style: { height: "2px" } }}
          >
            <Tab label={label} className={classes.tab} value={"1"} />
          </Tabs>

          <TabPanel value={"1"} style={{ padding: "0" }}>
            <div className={classes.cover}>
              <FromTo
                from={from}
                to={to}
                toggleForm={toggleForm}
                setFrom={setFrom}
                setTo={setTo}
                setToggleForm={setToggleForm}
                toggle={toggle}
              />
            </div>
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

const tokens = [
  {
    name: "OSMO",
    id: "osmo-test-4",
    logo: "img/osmo.png",
    price: "0.6757",
    balance: "0",
  },
  {
    name: "INJ",
    id: "injective-888",
    logo: "img/inj.png",
    price: "6.58",
    balance: "0",
  },
  {
    name: "CTOKEN",
    id: "TKN",
    price: "0.99",
    balance: "0",
    logo: "img/erc20.png",
  },
];

const useStyles = makeStyles(() => ({
  formSection: {
    padding: "30px 0 90px",
    width: "30%",
    margin: "0 auto",
    "@media (max-width: 768px)": {
      width: "100%",
    },
  },
  // for outer form container
  outerFormContainer: {
    backgroundColor: "#F6F6F6",
    minHeight: "200px",
    filter: "drop-shadow(0px 2px 20px rgba(0, 0, 0, 0.2))",
    position: "relative",
    zIndex: 1,
    borderRadius: "16px",
    overflow: "hidden",

    "@media (max-width: 768px)": {
      borderRadius: "8px",
    },
  },
  tabBar: {
    // height: "70px",
    borderBottom: "1px solid #30475E",
    display: "flex",
    padding: "0 26px",

    "@media (max-width: 768px)": {
      padding: "0 14px",
    },
  },
  // for tab bar
  tab: {
    marginRight: "20px",
    color: "#0A1D37",
    cursor: "pointer",
    fontSize: "16px",
    textTransform: "none",
    padding: "0",
    minWidth: "auto",

    "&:hover": {
      color: "#0A1D37",
    },
  },
  cover: {
    padding: "36px 26px",
    "@media (max-width: 768px)": {
      width: "100%",
      padding: "20px 14px",
    },
  },
}));

export default FormSection;
