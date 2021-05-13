import {baseUrl} from "./url";

export const createFund = async (token, name, fund_type) => {
    const body = JSON.stringify({trust_fund: {name: name, fund_type: fund_type}})
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: body
    }
    console.log("->" + body)
    const response = await fetch(`${baseUrl}/api/v1/trust_fund`, requestOptions)
    return response.json()
}
