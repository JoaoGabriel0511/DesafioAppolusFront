import React from "react";

export default function (response) {
    const errors = []
    Object.keys(response.errors).forEach(field_errors => {
        response.errors[field_errors].forEach(error => {
            let fieldFormatted = field_errors.replace("_", " ")
            fieldFormatted = fieldFormatted.charAt(0).toUpperCase() + fieldFormatted.slice(1)
            errors.push(<li>{fieldFormatted} {error}</li>)
        })
    })
    return errors
}