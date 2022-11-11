const baseURL = "http://localhost:5000"

export const endpoint = {
    "login": `${baseURL}/api/auth/login`,
    "logout": `${baseURL}/api/auth/logout`,
    "add_income": `${baseURL}/api/income`,
    "split_income": `${baseURL}/api/income/split`,
    "get_split_income": (timestamp) => `${baseURL}/api/income/split/${timestamp}`,
    "split_income_del": (id) => `${baseURL}/api/income/split/${id}`,
    "add_expense": `${baseURL}/api/add/expense`,
    "delete_expense" : (id) => `${baseURL}/api/delete/expense/${id}`,
    "expense_filter": `${baseURL}/api/filter/expense`,
}