import { loadChart } from "./chart.js";
import { loadAlertFunction } from "./modules/alert.js";
import { endpoint } from "./modules/endpoint.js";
import { loadExpenseFunction } from "./modules/expense.js";
import { loadIncomeFunction } from "./modules/income.js";
import { loadData } from "./modules/starter.js";
import { user } from "./modules/user_data.js";

// Toggle different views - expense, split, alert
const headerToggler = document.querySelectorAll(".header-btn");
let activeHeader = document.querySelector(".expense-add");

headerToggler.forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelector(".expense-header .active").classList.remove("active");
        e.target.classList.add("active");
        activeHeader.classList.add("none");
        const toActivate = document.querySelector(`.${e.target.dataset["class"]}`);
        toActivate.classList.remove("none");
        activeHeader = toActivate;
    })
})

const logoutBtn = document.querySelector(".user-logout");

const logoutUser= async () => {
    const res = await fetch(endpoint.logout, {
        credentials: 'include'
    })
    if(res.status === 200){
        toggleUserLogged(false, '');
    }
}

logoutBtn.addEventListener("click", logoutUser);
const isUserLoggedIn = async () => {
    const res = await fetch(endpoint.login, {
        method: "GET",
        credentials: "include"
    });
    return res;
}

const toggleUserLogged = (isLoggedIn, username, userData, incomeData, balance_data, expense_data) => {
    const navLogin = document.querySelector(".login");
    const navUser = document.querySelector(".user");
    const main = document.querySelector("main");
    if(isLoggedIn){
        navLogin.classList.add("none");
        navUser.classList.remove("none");
        username = username.split('@');
        navUser.querySelector(".user-name").innerText = username[0];
        user.setInitial(username[0], userData, incomeData, balance_data, expense_data);
    }
    else{
        navLogin.classList.remove("none");
        navUser.classList.add("none");
        navUser.querySelector(".user-name").innerText = '';
        user.resetData();
        main.classList.add("none");
    }
}
const nav = document.querySelector("nav");
const loading = document.querySelector(".loading");

window.addEventListener("load", async () => {
    const res = await isUserLoggedIn();
    const data = await res.json();
    if(res.status == 200){
        toggleUserLogged(true, data['email'], data['user_data'], data['split_data'], data['balance_data'], data['expense_data'])
        loadData();
        loadExpenseFunction();
        loadIncomeFunction();
        loadAlertFunction();
        loadChart()
    }
    else{
        nav.classList.remove("none");
        loading.classList.add("none");
    }
});