import React, {useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {depositValue, recoverAccountData, withdrawValue} from "../services/api/account";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    TextField,
    Tooltip
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DeleteIcon from '@material-ui/icons/Delete';
import {useHistory} from "react-router-dom";
import {deleteUser} from "../services/api/users";
import Button from "@material-ui/core/Button";
import numberFormatter from "../utils/numberFormatter";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    main: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2),
    },
    footer: {
        padding: theme.spacing(3, 2),
        marginTop: 'auto',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    },
    root_alt: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));
export default function Account() {
    const classes = useStyles();
    const [userData, setUserData] = React.useState({name: "", email: ""})
    const [accountData, setAccountData] = React.useState({balance: ""})
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openSnackBar, setOpenSnackbar] = React.useState(false)
    const [dialogMessage, setDialogMessage] = React.useState("")
    const [operationIsDeposit, setOperationIsDeposit] = React.useState(false)
    const [balanceOperationValue, setBalanceOperationValue] = React.useState(0)
    const [snackbarMessage, setSnackbarMessage] = React.useState("")
    const horizontal = 'center';
    const vertical = 'top';

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
    }

    const balanceOperation = () => {
        if(operationIsDeposit) {
            deposit()
        } else {
            withdraw()
        }
    }

    async function deposit() {
        const response = await depositValue(localStorage.getItem("USER_TOKEN"), balanceOperationValue)
        const accountData = {
            balance: response.data.transaction.balance
        }
        setAccountData(accountData)
        handleCloseDialog()
    }

    async function withdraw() {
        const response = await withdrawValue(localStorage.getItem("USER_TOKEN"), balanceOperationValue)
        if(response.error != null){
            setOpenSnackbar(true)
            setSnackbarMessage(response.error)
        } else {
            const accountData = {
                balance: response.data.transaction.balance
            }
            setAccountData(accountData)
        }
        handleCloseDialog()
    }

    const handleDepositDialog = () => {
        setDialogMessage("Deposit")
        setOperationIsDeposit(true)
        handleClickOpenDialog()
    }

    const handleWithdrawDialog = () => {
        setDialogMessage("Withdraw")
        setOperationIsDeposit(false)
        handleClickOpenDialog()
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const history = useHistory();

    useEffect(() => {
        loadAccountData();
    }, []);

    const loadAccountData = async () => {
        const response = await recoverAccountData(localStorage.getItem("USER_TOKEN"))
        const userData = {
            name: response.data.user.name,
            email: response.data.user.email
        }
        const accountData = {
            balance: parseFloat(response.data.account.balance)
        }
        setUserData(userData)
        setAccountData(accountData)
    }

    const editUser = async () => {
        history.push({
            pathname: '/EditProfile'
        })
    }

    const logout = async () => {
        localStorage.removeItem("USER_TOKEN")
        history.push('/')
    }

    const deleteAccount = async () => {
        await deleteUser(localStorage.getItem("USER_TOKEN"))
        localStorage.removeItem("USER_TOKEN")
        history.push('/')
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Container component="main" className={classes.main} maxWidth="sm">
                <Tooltip title="Edit profile">
                    <Fab aria-label="add" onClick={editUser}>
                        <EditIcon />
                    </Fab>
                </Tooltip>
                <Tooltip title="Delete account">
                    <Fab color="secondary" aria-label="add" onClick={deleteAccount}>
                        <DeleteIcon />
                    </Fab>
                </Tooltip>
                <Tooltip title="Logout">
                    <Fab color="primary" aria-label="add" onClick={logout}>
                        <ExitToAppIcon />
                    </Fab>
                </Tooltip>
                <Typography variant="h2" component="h1" gutterBottom>
                    {userData.name} account
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    {`Balance: $${numberFormatter(accountData.balance)}`}
                </Typography>
                <div className={classes.root_alt}>
                    <Button variant="contained" color="primary" onClick={handleDepositDialog}>
                        DEPOSIT
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleWithdrawDialog}>
                        WITHDRAW
                    </Button>
                </div>
                <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            onChange={(e) => {setBalanceOperationValue(parseFloat(e.target.value))}}
                            margin="dense"
                            id="value"
                            label="Value"
                            type="number"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={balanceOperation} color="primary">
                            {dialogMessage}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical,  horizontal }}>
                    <Alert onClose={handleCloseSnackbar} severity="error">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </div>
    );
}