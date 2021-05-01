import {baseUrl} from "./url";

export const createUser = async (userData) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { name: userData.name, email: userData.email, password: userData.password, password_confirmation: userData.password_confirmation }})
    };
    const response = await fetch(`${baseUrl}/users`, requestOptions)
    return response.json()
};

export const deleteUser = async (token) => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    const response = await fetch(`${baseUrl}/api/v1/user`, requestOptions)
    return response.json()
}

export const editUser = async (token, userData) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({ user: { name: userData.name, email: userData.email }})
    };
    const response = await fetch(`${baseUrl}/api/v1/user`, requestOptions)
    return response.json()
}