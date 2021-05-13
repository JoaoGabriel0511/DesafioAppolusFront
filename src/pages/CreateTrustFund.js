import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {createUser} from "../services/api/users";
import { useHistory } from "react-router-dom";
import Routes from "../Routes";
import {Input, InputLabel, MenuItem, Select, useTheme} from "@material-ui/core";
import {createFund} from "../services/api/trustFund";
import errorHandler from "../utils/errorHandler";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));



export default function CreateTrustFund() {
    const classes = useStyles();
    const horizontal = 'center';
    const vertical = 'top';
    const [open, setOpen] = React.useState(false);
    const [openSelect, setOpenSelect] = React.useState(false);
    const [trustFundType, setTrustFundType] = React.useState("");
    const [name, setName] = React.useState("");
    const [errorList, setErrorList] = React.useState([<li>exemplo</li>]);

    const history = useHistory();

    const fundTypes = [
        'STOCK',
        'FUND',
        'DIRECT_TREASURY',
    ];

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleCloseSelect = () => {
        setOpenSelect(false);
    };


    const handleChange = (event) => {
        setTrustFundType(event.target.value);
    };

    const createTrustFund = async (event) => {
        event.preventDefault()
        const response = await createFund(localStorage.getItem("USER_TOKEN"), name, trustFundType)
        if (response.errors != null) {
            const errors = errorHandler(response)
            setErrorList(errors)
            setOpen(true)
        } else {
            history.push({
                pathname: '/Account',
                state: {
                    userCreated: true
                }
            })
        }
    }

    const handleOpenSelect = () => {
        setOpenSelect(true);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create Trust Fund
                </Typography>
                <form onSubmit={createTrustFund} className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                onChange={e => setName(e.target.value)}
                                autoComplete="fname"
                                name="Name"
                                variant="outlined"
                                required
                                fullWidth
                                id="Name"
                                label="Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel id="demo-mutiple-name-label">Trust Fund Type</InputLabel>
                            <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={openSelect}
                                onClose={handleCloseSelect}
                                onOpen={handleOpenSelect}
                                value={trustFundType}
                                onChange={handleChange}
                            >
                                {fundTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type.replace('_', ' ')}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical,  horizontal }}>
                        <Alert onClose={handleClose} severity="error">
                            <ul>
                                {errorList}
                            </ul>
                        </Alert>
                    </Snackbar>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Create
                    </Button>
                </form>
            </div>
        </Container>
    );
}