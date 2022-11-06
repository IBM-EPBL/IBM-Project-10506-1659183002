import { endpoint } from "./modules/endpoint.js";
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
        toggleUserLogged(false, '')
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

const toggleUserLogged = (isLoggedIn, username, incomeData) => {
    const navLogin = document.querySelector(".login");
    const navUser = document.querySelector(".user");
    if(isLoggedIn){
        navLogin.classList.add("none");
        navUser.classList.remove("none");
        username = username.split('@');
        navUser.querySelector(".user-name").innerText = username[0];
        user.setInitial(username[0], incomeData[0]["TOTAL_AMOUNT"], incomeData);
        console.log(user.getData('username'));
    }
    else{
        navLogin.classList.remove("none");
        navUser.classList.add("none");
        navUser.querySelector(".user-name").innerText = '';
    }
}

window.addEventListener("load", async () => {
    const res = await isUserLoggedIn();
    const data = await res.json();
    console.log(data);
    if(res.status == 200){
        toggleUserLogged(true, data['email'], data['data'])
        loadData(data['data']);
        loadIncomeFunction();
    }
});