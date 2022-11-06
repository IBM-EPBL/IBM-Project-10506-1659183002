import { endpoint } from "./endpoint.js";
import { split_data_template } from "./template.js";
import { user } from "./user_data.js";

const incomeForm = document.querySelector(".user-income-form");
const editIncomeBtn = document.querySelector(".edit-income-ic");
const tickBtn = document.querySelector(".accept-income-ic");

let isTrigger = false;
let prevValue = 0;
const incomeInp = document.querySelector("#income");
const editIncome = (e) => {
    e.preventDefault();
    console.log(prevValue)
    if(isTrigger && +incomeInp.value !== prevValue){
        updateIncome(+incomeInp.value)
    }
    prevValue = incomeInp.value ? +incomeInp.value : 0;
    incomeInp.readOnly = isTrigger;
    incomeInp.focus();
    editIncomeBtn.classList.toggle("none");
    tickBtn.classList.toggle("none");
    isTrigger = !isTrigger;
}

const updateIncome = async (amount) => {
    const timestamp = Date.now();
    console.log(timestamp)
    const data = {
        amount,
        timestamp
    };
    console.log('hi')
    const res = await fetch(endpoint.add_income, {
        method:"POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const status = await res.json();
    if(res.status === 200){
        user.setData('balance', amount);
        document.querySelector(".balance span").innerText = amount;
    }
    console.log(status);
}

export const updateBalance = (amount) => {
    const balanceEle = document.querySelector(".balance span");
    console.log(balanceEle, amount)
    balanceEle.innerText = +amount;
}

export const updateSplitData = () => {
    const split_data_cnt = document.querySelector(".split-values");
    const split_value_cnt = split_data_cnt.querySelectorAll(".split-value");
    split_value_cnt.forEach((ele, idx) => {
        if(idx == 0)  return;
        split_data_cnt.removeChild(ele);
    })
    user.getData('splitData').forEach(data => {
        split_data_cnt.appendChild(split_data_template(data))
    });
}

export const loadIncomeFunction = () => {
    editIncomeBtn.addEventListener("click", editIncome);
    tickBtn.addEventListener("click", editIncome);
    incomeForm.addEventListener("submit", editIncome);
}