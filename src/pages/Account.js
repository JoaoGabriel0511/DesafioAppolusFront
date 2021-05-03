import React, {useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {depositValue, recoverAccountData, recoverStatement, withdrawValue} from "../services/api/account";
import {
    AppBar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab, IconButton, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Toolbar,
    Tooltip, withStyles
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
import CancelIcon from '@material-ui/icons/Cancel';
import transitions from "@material-ui/core/styles/transitions";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

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
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    table: {
        minWidth: 700,
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
    const [openStatement, setOpenStatement] = React.useState(false)
    const [accountStatement, setAccountStatement] = React.useState([])
    const [statementDate, setStatementDate] = React.useState(new Date())
    const horizontal = 'center';
    const vertical = 'top';

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseStatement = () => {
        setOpenStatement(false)
    }

    const handleOpenStatement = async () => {
        const response = await recoverStatement(localStorage.getItem("USER_TOKEN"))
        setStatementDate(new Date())
        setAccountStatement(response.data.account_statement)
        setOpenStatement(true)
    }

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

    const filterTransactionsFromCurrentDate = (statement) => {
        return statement.filter((transition) => {
            return new Date(transition.created_at).toDateString() === statementDate.toDateString()
        })
    }

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

    const nextDay = async () => {
        var tomorrow = new Date(statementDate)
        tomorrow.setDate(tomorrow.getDate() + 1)
        setStatementDate(tomorrow)
    }

    const prevDay = async () => {
        var yesterday = new Date(statementDate)
        yesterday.setDate(yesterday.getDate() - 1)
        setStatementDate(yesterday)
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
                <div className={classes.root_alt}>
                    <Button variant="contained" onClick={handleOpenStatement}>STATEMENT</Button>
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
                <Dialog fullScreen open={openStatement} onClose={handleCloseStatement} TransitionComponent={Transition}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleCloseStatement} aria-label="close">
                                <CancelIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Account Statement
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center"><Button variant="contained" onClick={prevDay}>Prev day</Button></StyledTableCell>
                                    <StyledTableCell align="center">{statementDate.toDateString()}</StyledTableCell>
                                    <StyledTableCell align="center"><Button variant="contained" onClick={nextDay}>Next day</Button></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">Operation</StyledTableCell>
                                    <StyledTableCell align="center">Value</StyledTableCell>
                                    <StyledTableCell align="center">Resulting Balance</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filterTransactionsFromCurrentDate(accountStatement).map((transaction) => (
                                    <StyledTableRow key={transaction}>
                                        <StyledTableCell align="center" component="th" scope="row">
                                            {transaction.transaction_type}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">{transaction.value}</StyledTableCell>
                                        <StyledTableCell align="center">{transaction.balance}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Dialog>
            </Container>
        </div>
    );
}