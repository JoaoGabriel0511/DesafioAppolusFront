import React from "react";
import {  BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import EditProfile from "./pages/EditProfile";

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <Login />
                </Route>
            </Switch>
            <Switch>
                <Route exact path="/Signup">
                    <SignUp />
                </Route>
            </Switch>
            <Switch>
                <Route exact path="/Account">
                    <Account />
                </Route>
            </Switch>
            <Switch>
                <Route exact path="/EditProfile">
                    <EditProfile />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}