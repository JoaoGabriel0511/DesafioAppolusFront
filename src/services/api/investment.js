import {baseUrl} from "./url";

export const recoverUserTrustFundInvestment = async (token, trustFundId) => {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    }
    const response = await fetch(`${baseUrl}/api/v1/account_investment/${trustFundId}`, requestOptions)
    return response.json()
}

export const investValue = async (token, trustFundId, value) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({investment: {value: value, trust_fund_id: trustFundId}})
    }
    const response = await fetch(`${baseUrl}/api/v1/trust_fund/invest`, requestOptions)
    return response.json()
}

export const withdrawInvestmentValue = async (token, trustFundId, value) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify({investment: {value: value, trust_fund_id: trustFundId}})
    }
    const response = await fetch(`${baseUrl}/api/v1/trust_fund/withdraw`, requestOptions)
    return response.json()
}