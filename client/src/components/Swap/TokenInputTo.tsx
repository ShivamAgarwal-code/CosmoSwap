import React from "react";
import { makeStyles } from "@mui/styles";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

type Tokens = {
  name: string;
  id: string;
  logo: string;
  price: string;
  balance: string;
};
type ITokenInput = {
  token: Tokens;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setTo: React.Dispatch<React.SetStateAction<Tokens>>;
};

const TokenInput = ({ value, onChange, token, setTo }: ITokenInput) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.tokenInputContainer}>
        <input
          type="number"
          value={value}
          onChange={onChange}
          required
          placeholder={`0.00 ${token.name ? token.name : token}`}
          readOnly={onChange ? false : true}
          onWheel={(event) => event.currentTarget.blur()}
        />
        {/* <div className={classes.chainIndicator}>
          <p className="chain-name">{token}</p>
        </div> */}
        <div className={classes.chainIndicator}>
          <FormControl sx={{ height: 50 }}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{ color: "black", top: 6, left: -5 }}
            >
              To
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={token.name ? token.name : token}
              label="token"
              onChange={(e: any) => {
                console.log(e.target.value);
                setTo(e.target.value);
              }}
              sx={{
                border: "none",
                backgroundColor: "#AEE0E1",
                display: "flex",
                alignItems: "center",
                width: "160px",

                "& .MuiSelect-select": {
                  display: "flex",
                  paddingRight: 10,
                  alignItems: "center",
                },
              }}
            >
              {tokens.map((token) => (
                <MenuItem value={token.name} key={token.name}>
                  <img
                    src={token.logo}
                    alt={token.name}
                    className={classes.logo}
                  />
                  {token.name}
                  <p style={{ marginLeft: 10 }}>{token.balance}</p>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </>
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

const useStyles = makeStyles((theme) => ({
  tokenInputContainer: {
    width: "100%",
    backgroundColor: "#222831",
    borderRadius: "6px",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",

    "& input": {
      width: "100%",
      border: 0,
      outline: 0,
      backgroundColor: "transparent",
      fontSize: 18,
      fontWeight: "700",
      color: "white",
      paddingLeft: "5px",
      textAlign: "left",
      lineHeight: "40px",

      //   hide arrows
      "-moz-appearance": "textfield",
      "&::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "&::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
    },
  },

  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  chainIndicator: {
    "& .block": {
      display: "flex",
      padding: "6px 10px",
      borderRadius: "5px",
      backgroundColor: "#393E46",

      "& .chain-icon": {
        width: "30px",
        height: "30px",
        borderRadius: "15px",
        marginRight: "10px",
        backgroundSize: "cover",
      },

      "& .chain-name": {
        fontSize: "16px",
        fontWeight: "600",
        color: "white",
        margin: 0,
        lineHeight: "30px",
        whiteSpace: "nowrap",
      },
    },
  },
}));

export default TokenInput;
