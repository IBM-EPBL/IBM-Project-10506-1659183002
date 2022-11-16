const baseURL = "https://169.51.194.117:31215"

export const endpoint = {
    "register": `${baseURL}/api/auth/register`,
    "resendMail": `${baseURL}/api/auth/verify`,
    "login": `${baseURL}/api/auth/login`,
    "logout": `${baseURL}/api/auth/logout`,
    "confirm_token": `${baseURL}/api/auth/verify`,
    "add_income": `${baseURL}/api/income`,
    "split_income": `${baseURL}/api/income/split`,
    "get_split_income": (timestamp) => `${baseURL}/api/income/split/${timestamp}`,
    "split_income_del": (id) => `${baseURL}/api/income/split/${id}`,
    "add_expense": `${baseURL}/api/add/expense`,
    "delete_expense" : (id) => `${baseURL}/api/delete/expense/${id}`,
    "expense_filter": `${baseURL}/api/filter/expense`,
    "alert": `${baseURL}/api/alert`
}