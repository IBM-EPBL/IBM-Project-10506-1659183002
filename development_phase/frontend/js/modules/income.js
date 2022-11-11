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
    const data = {
        amount,
        timestamp
    };
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
    console.log(user.getData('splitData'))
    user.getData('splitData').forEach(data => {
        const split_value_div = split_data_template(data);
        console.log(split_value_div);
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
    console.log('hi')
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
const addSplitIncome = async (e) => {
    e.preventDefault();
    if(splitAmount === 0 || isSplitProgress){
        return;
    }
    isSplitProgress = true;
    const data = {
        amount: splitAmount,
        label
    };
    const res = await fetch(endpoint.split_income, {
        method:"POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const msg = await res.json();
    isSplitProgress = false;
    if(res.status === 200){
        user.updateSplitData(data);
        updateSplitData();
        splitAmountInp.value = ""
    }
}

export const fetchSplitIncome = async () => {
    const res = await fetch(endpoint.get_split_income(user.getData('timestamp')), {
        method:"GET",
        credentials: 'include',
    });
    const resData = await res.json();
    console.log(resData)
    if(res.status === 200){
        // user.setSplitData(resData["data"]);
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