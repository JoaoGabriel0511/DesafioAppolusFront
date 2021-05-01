import React, {useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {recoverAccountData} from "../services/api/account";
import {Fab, Tooltip} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DeleteIcon from '@material-ui/icons/Delete';
import {useHistory} from "react-router-dom";
import {deleteUser} from "../services/api/users";

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
}));
export default function Account() {
    const classes = useStyles();
    const [userData, setUserData] = React.useState({name: "", email: ""})
    const history = useHistory();
    useEffect(() => {
        loadAccountData();
    }, []);

    const loadAccountData = async () => {
        const response = await recoverAccountData(localStorage.getItem("USER_TOKEN"))
        const userData = {
            name: response.data.name,
            email: response.data.email
        }
        setUserData(userData)
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
                    {'Pin a footer to the bottom of the viewport.'}
                    {'The footer will move as the main element of the page grows.'}
                </Typography>
                <Typography variant="body1">Sticky footer placeholder.</Typography>
            </Container>
            <footer className={classes.footer}>
                <Container maxWidth="sm">
                    <Typography variant="body1">My sticky footer can be found here.</Typography>
                </Container>
            </footer>
        </div>
    );
}