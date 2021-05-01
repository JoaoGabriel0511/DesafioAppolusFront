import {baseUrl} from "./url";

export const recoverAccountData = async (token) => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    const response = await fetch(`${baseUrl}/api/v1/account`, requestOptions)
    return response.json()
}