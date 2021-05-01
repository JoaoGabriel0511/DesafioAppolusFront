import React, {useEffect, useState} from 'react';
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
import {createUser, editUser} from "../services/api/users";
import { useHistory } from "react-router-dom";
import Routes from "../Routes";
import {recoverAccountData} from "../services/api/account";

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

export default function EditProfile() {
    const classes = useStyles();
    const horizontal = 'center';
    const vertical = 'top';
    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = useState();
    const [name, setName] = useState();
    const [errorList, setErrorList] = useState([<li>exemplo</li>]);
    useEffect(() => {
        loadAccountData();
    }, []);

    const loadAccountData = async () => {
        const response = await recoverAccountData(localStorage.getItem("USER_TOKEN"))
        setEmail(response.data.email)
        setName(response.data.name)
    }

    const history = useHistory();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    async function editProfile(event) {
        event.preventDefault()
        const userData = {
            name: name,
            email: email
        }
        const response = await editUser(localStorage.getItem("USER_TOKEN"), userData);
        if(response.errors != null) {
            const errors = []
            Object.keys(response.errors).forEach(field_errors => {
                response.errors[field_errors].forEach(error => {
                    let fieldFormatted = field_errors.replace("_", " ")
                    fieldFormatted = fieldFormatted.charAt(0).toUpperCase() + fieldFormatted.slice(1)
                    errors.push(<li>{fieldFormatted} {error}</li>)
                })
            })
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
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Edit Profile
                </Typography>
                <form onSubmit={editProfile} className={classes.form} noValidate>
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
                                value={name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={(e) => setEmail(e.target.value)}
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                            />
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
                        Edit Profile
                    </Button>
                </form>
            </div>
        </Container>
    );
}