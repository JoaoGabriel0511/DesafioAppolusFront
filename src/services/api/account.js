import {baseUrl} from "./url";

export const recoverAccountData = async (token) => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    const response = await fetch(`${baseUrl}/api/v1/account`, requestOptions)
    return response.json()
}

export const depositValue = async (token, value) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({deposit: {value: value}})
    }
    const response = await fetch(`${baseUrl}/api/v1/account/deposit`, requestOptions)
    return response.json()
}

export const withdrawValue = async (token, value) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({withdraw: {value: value}})
    }
    const response = await fetch(`${baseUrl}/api/v1/account/withdraw`, requestOptions)
    return response.json()
}