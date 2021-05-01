import {baseUrl} from "./url";

export const authenticateUser = async (email, password) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
    };
    const response = await fetch(`${baseUrl}/api/v1/auth`, requestOptions)
    return response.json()
}