import { loadChart } from "../chart.js";
import { send_usage_alert } from "./alert.js";
import { endpoint } from "./endpoint.js";
import { fetchSplitIncome, updateBalance } from "./income.js";
import { expense_data_template } from "./template.js";
import { user } from "./user_data.js";

let is_income = false;
let label = "Food & Drinks";

const labelDropDown = document.querySelector("#amount-label");
const radioTypeBtn = document.querySelectorAll(".radio-type-expense");
const expenseForm = document.querySelector(".expense-add-form");

const updateIsIncome = (e) => {
    is_income = e.currentTarget.dataset.value === "true" ? true : false;
    if(is_income){
        radioTypeBtn[0].classList.add("active");
        radioTypeBtn[1].classList.remove("active");
    }
    else{
        radioTypeBtn[1].classList.add("active");
        radioTypeBtn[0].classList.remove("active");
    }
}
const updateLabelValue = (e) => {
    label =e.target.value;
}

let isAddProgress = false;
const addExpenseLoading = document.querySelector(".expense-add .expense-split-btn img");
const addExpense = async (e) => {
    e.preventDefault();
    if(isAddProgress){
        return;
    }
    addExpenseLoading.classList.remove("none");
    isAddProgress = true;
    const amountInp = document.querySelector("#amount-inp");
    const amount = +amountInp.value;
    const timestamp = Date.now();
    const data = {
        amount,
        label,
        is_income,
        timestamp
    }
    const res = await fetch(endpoint.add_expense, {
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
        amountInp.value = "";
        user.updateUserExpenseData(data);
        if(isFilterPresent === false){
            updateExpenseData(user.getData('expenseData'));
        }
        updateBalance();
        fetchSplitIncome();
        send_usage_alert();
        loadChart();
    }
    addExpenseLoading.classList.add("none");
    isAddProgress = false;
}

export const updateExpenseData = (expenseData) => {
    const expenseValuesCnt = document.querySelector(".expense-his-values");
    const expenseValueCnt = document.querySelectorAll(".expense-his-value");
    expenseValueCnt.forEach(child => {
        expenseValuesCnt.removeChild(child);
    })
    if(expenseData.length === 0){
        document.querySelector(".expense-msg").classList.remove("none");
        return;
    }
    document.querySelector(".expense-msg").classList.add("none");
    expenseData.forEach(eachData => {
        const valueDiv = expense_data_template(eachData);
        expenseValuesCnt.appendChild(valueDiv)
    })
}

// Filter expense
const fromDateInp = document.querySelector("#from-date");
const toDateInp = document.querySelector("#to-date");
const filterLabelInp = document.querySelector("#filter-label");
const updateBtn = document.querySelector('.filter-update-btn');
const resetBtn = document.querySelector('.filter-reset-btn');
let filterData = false, isFilterPresent = false;
const getTimestampFromDate = (dateStr) => {
    const datePart = dateStr.split('-');
    const date = new Date(datePart[0], datePart[1]-1, datePart[2]);
    return date.getTime();
}

let prevToTimestamp = 0, currToTimestamp = 0, prevFromTimestamp = 0, currFromTimestamp = 0; 

const setDate = (is_toDate, e) => {
    const dateStr = e.target.value;
    is_toDate ? 
        (currToTimestamp = getTimestampFromDate(dateStr) + (60 * 60 * 24 * 1000) - 1000) :
        (currFromTimestamp = getTimestampFromDate(dateStr))
}

const filterExpenseLabel = () => {
    const label = filterLabelInp.value;
    isFilterPresent = filterData === false ? false : true;
    const toUpdateData = filterData === false ? user.getData('expenseData') : filterData;
    if(label === "None"){
        updateExpenseData(toUpdateData);
        return;
    }
    isFilterPresent = true;
    const newFilterData = toUpdateData.filter(eachData => eachData["LABEL"] === label)
    updateExpenseData(newFilterData)
}

let isFilterProcessing = false;
const filterExpenseLoading = document.querySelector(".filter-update-btn img");

const getFilterExpense = async (e) => {
    e.preventDefault();
    if(isFilterProcessing || (currToTimestamp == 0 || currFromTimestamp == 0) || currFromTimestamp >= currToTimestamp || (currToTimestamp == prevToTimestamp && currFromTimestamp == prevFromTimestamp) ){
        filterExpenseLabel(user.getData('expenseData'));
        return;
    }
    filterExpenseLoading.classList.remove("none");
    isFilterProcessing = true;
    const bodyData = {
        fromTimestamp: currFromTimestamp,
        toTimestamp: currToTimestamp
    }
    const res = await fetch(endpoint.expense_filter, {
        method:"POST",
        credentials: 'include',
        mode:"cors",
        headers:{
            "Access-Control-Allow-Origin":"*",
            "content-type":"application/json",
        },
        body: JSON.stringify(bodyData)
    });
    if(res.status === 200){
        const resData = await res.json();
        filterData = resData["expense_data"]
        filterExpenseLabel()
        prevFromTimestamp = currFromTimestamp;
        prevToTimestamp =currToTimestamp;
    }
    filterExpenseLoading.classList.add("none");
    isFilterProcessing = false;
}

const resetFilter = (e) => {
    e.preventDefault();
    isFilterPresent = false;
    toDateInp.value = fromDateInp.value = "";
    filterLabelInp.value = "None";
    filterData = false;
    filterExpenseLabel();
}

export const loadExpenseFunction = () => {
    labelDropDown.addEventListener("change", updateLabelValue);
    radioTypeBtn.forEach(btn => {
        btn.addEventListener("click", updateIsIncome)
    });
    expenseForm.addEventListener("submit", addExpense);
    fromDateInp.addEventListener("change", setDate.bind(null, false));
    toDateInp.addEventListener("change", setDate.bind(null, true));
    updateBtn.addEventListener("click", getFilterExpense);
    resetBtn.addEventListener("click", resetFilter);
}