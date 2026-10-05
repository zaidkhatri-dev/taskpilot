import { ErrorMapper } from "@/types/error.js";
import { DatabaseError } from "pg";

const UNIQUE_CONSTRAINT_MESSAGES: Readonly<Record<string, string>> = {
    users_email_key: "Email already exists.",
    users_username_key: "Username already exists.",
}

const FOREIGN_KEY_CONSTRAINT_MESSAGES: Readonly<Record<string, string>> = {
    // Scenario A: Inserting/Updating (Parent record missing)
    'orders_user_id_fkey': 'The specified user account does not exist.',
    'products_category_id_fkey': 'The selected product category is invalid.',

    // Scenario B: Deleting (Child records block deletion)
    'fk_user_profile': 'Cannot delete this user because they have active profile data attached.'
}

const CONSTRAINT_MESSAGES: Readonly<Record<string, string>> = {
    chk_positive_amount: "Amount must be greater than zero.",
    chk_valid_date_range: "End date must be after start date.",
};

export const dbErrorMapper = (err: DatabaseError): ErrorMapper => {
    console.error({
        message: err.message,
        code: err.code,
        detail: err.detail,
        constraint: err.constraint,
        table: err.table,
        schema: err.schema
    })

    switch (err.code) {
        case "23505": {
            const message = (err.constraint && UNIQUE_CONSTRAINT_MESSAGES[err.constraint]) || 
            "Resource already exists."
            return {
                message,
                statusCode: 409
            }
        }

        case "23503": {
            const message = (err.constraint && FOREIGN_KEY_CONSTRAINT_MESSAGES[err.constraint]) || 
            "Related resource does not exist."
            return {
                message,
                statusCode: 409
            }
        }

        case "23502": {
            const message = err.column ? `${err.column} is required.` : 
            "Required field is missing."
            return {
                message,
                statusCode: 400
            }
        }

        case "23514": {
            const message = (err.constraint && CONSTRAINT_MESSAGES[err.constraint]) || "Data violates business rules."
            return {
                message,
                statusCode: 400
            }
        }

        case "22P02": {
            return {
                message: "Invalid Input.",
                statusCode: 400
            }
        }

        default:
            return {
                message: "Something went wrong.",
                statusCode: 500,
            }
    }
}