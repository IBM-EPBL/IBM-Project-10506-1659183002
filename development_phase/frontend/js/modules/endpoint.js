const baseURL = "http://localhost:5000"

export const endpoint = {
    "login": `${baseURL}/api/auth/login`,
    "logout": `${baseURL}/api/auth/logout`,
    "add_income": `${baseURL}/api/income`,
    "split_income": `${baseURL}/api/income/split`,
    "split_income_del": (id) => `${baseURL}/api/income/split/${id}`
}