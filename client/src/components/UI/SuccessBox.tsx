import { makeStyles } from "@mui/styles";

const SuccessBox = ({ message }: any) => {
  const classes = useStyles();
  return (
    <div>
      <p className={classes.formError}>
        <br />
        <a href={`https://app.0x.org/portal/swap`} target="_blank">
          <b>Assets Recieved. Click here to view on Relayer</b>
        </a>
      </p>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  formError: {
    fontSize: "15px",
    color: "#ce1212",
    backgroundColor: "#FFDEDE",
    padding: "20px",
    marginTop: "26px",
    borderRadius: "6px",
  },
}));

export default SuccessBox;
