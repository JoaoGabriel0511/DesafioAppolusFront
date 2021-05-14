import {baseUrl} from "./url";

export const createFund = async (token, name, fund_type) => {
    const body = JSON.stringify({trust_fund: {name: name, fund_type: fund_type}})
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: body
    }
    const response = await fetch(`${baseUrl}/api/v1/trust_fund`, requestOptions)
    return response.json()
}

export const recoverTrustFunds = async (token) => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
    }
    const response = await fetch(`${baseUrl}/api/v1/trust_funds`, requestOptions)
    return response.json()
}
