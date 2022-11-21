import { endpoint } from "./endpoint.js";
import { labelId } from "./label.js";
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

let isUpdateProgress = false;
const updateIncome = async (amount) => {
    if(isUpdateProgress){
        return;
    }
    isUpdateProgress = true;
    const timestamp = Date.now();
    const data = {
        amount,
        timestamp
    };
    const res = await fetch(endpoint.add_income, {
        method:"POST",
        credentials: 'include',
        mode:"cors",
        headers:{
            "Access-Control-Allow-Origin":"*",
            "content-type":"application/json",
        },
        body: JSON.stringify(data)
    });
    if(res.status === 200){
        user.setData('balance', amount);
        user.setData('timestamp', timestamp);
        const date = new Date(timestamp);
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        document.querySelector(".from-date-disp span").innerText = dateStr;
        document.querySelector(".balance span").innerText = amount;
    }
    isUpdateProgress = false;
}

export const updateBalance = () => {
    const balanceEle = document.querySelector(".balance span");
    balanceEle.innerText = user.getData('balance');
}

export const updateSplitData = () => {
    const split_data_cnt = document.querySelector(".split-values");
    const split_value_cnt = split_data_cnt.querySelectorAll(".split-value");
    split_value_cnt.forEach((ele, idx) => {
        if(idx == 0)  return;
        split_data_cnt.removeChild(ele);
    })
    user.getData('splitData').forEach(data => {
        const split_value_div = split_data_template(data);
        split_data_cnt.appendChild(split_value_div);
        split_value_div.querySelector(".split-edit").addEventListener("click", removeSplitData);
    });
}

// income split
let splitAmount = 0;
let label = "Food & Drinks";
const updateLabelValue = (e) => {
    label =e.target.value;
}
const updateSplitPreview = (amount) => {
    const splitCnt = document.querySelector(".split-preview span");
    const isPercent = document.querySelector('input[name="split-type"]:checked').value;
    if(isPercent === "percent"){
        amount = amount > 100 ? 100 : amount;
        splitAmountInp.value = amount;
        amount = calculateAmount(amount)
    }
    else{
        if(amount > user.getData('balance')){
            amount = user.getData('balance');
            splitAmountInp.value = amount;
        }
    }
    splitCnt.innerText = `Rs ${amount}`;
    splitAmount = amount
}

const calculateAmount = (percentage) => {
    const balance = user.getData('balance');
    const amount = ((balance / 100) * percentage).toFixed(2);
    return amount
}

const splitAmountInp = document.querySelector("#split-amount-inp");
const radioOptions = document.querySelectorAll('input[name="split-type"]');
const labelDropDown = document.querySelector("#split-label");
const splitIncomeForm = document.querySelector(".split-income-form")
const changeSplitOnUpdate = (e) => {
    updateSplitPreview(+splitAmountInp.value)
}

let isSplitProgress = false;
const splitExpenseLoading = document.querySelector(".split-income .expense-split-btn img");
const addSplitIncome = async (e) => {
    e.preventDefault();
    if(splitAmount === 0 || isSplitProgress){
        return;
    }
    isSplitProgress = true;
    splitExpenseLoading.classList.remove("none");
    const data = {
        amount: splitAmount,
        label
    };
    const res = await fetch(endpoint.split_income, {
        method:"POST",
        credentials: 'include',
        mode:"cors",
        headers:{
            "Access-Control-Allow-Origin":"*",
            "content-type":"application/json",
        },
        body: JSON.stringify(data)
    });
    if(res.status === 200){
        user.updateSplitData(data);
        updateSplitData();
        splitAmountInp.value = ""
    }
    isSplitProgress = false;
    splitExpenseLoading.classList.add("none");

}

export const fetchSplitIncome = async () => {
    const res = await fetch(endpoint.get_split_income(user.getData('timestamp')), {
        method:"GET",
        credentials: 'include',
    });
    const resData = await res.json();
    if(res.status === 200){
        user.setSplitData(user.getData('splitData'), resData['balance_data']);
        updateSplitData();
    }
}

let isRemoveTriggered = false;
const removeSplitData = async (e) => {
    if(isRemoveTriggered){
        return;
    }
    isRemoveTriggered = true;
    const label = e.currentTarget.parentElement.dataset.value;
    const id = labelId[label]
    const res = await fetch(endpoint.split_income_del(id), {
        method:"DELETE",
        credentials: 'include',
    });
    if(res.status === 200){
        user.removeSplitData(label);
        updateSplitData();
    }
    isRemoveTriggered = false;
}

export const loadIncomeFunction = () => {
    editIncomeBtn.addEventListener("click", editIncome);
    tickBtn.addEventListener("click", editIncome);
    incomeForm.addEventListener("submit", editIncome);
    radioOptions.forEach(ele => {
        ele.addEventListener("change", changeSplitOnUpdate);
    });
    labelDropDown.addEventListener("change", updateLabelValue);
    splitAmountInp.addEventListener("change", changeSplitOnUpdate);
    splitIncomeForm.addEventListener("submit", addSplitIncome);
}