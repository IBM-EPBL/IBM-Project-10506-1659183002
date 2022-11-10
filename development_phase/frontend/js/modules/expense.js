import { endpoint } from "./endpoint.js";
import { fetchSplitIncome } from "./income.js";
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
    console.log(is_income);
}
const updateLabelValue = (e) => {
    label =e.target.value;
    console.log(label);
}

const addExpense = async (e) => {
    e.preventDefault();
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if(res.status === 200){
        amountInp.value = "";
        fetchSplitIncome();
    }
}

export const updateExpenseDate = () => {
    const expenseValuesCnt = document.querySelector(".expense-his-values");
    const expenseValueCnt = document.querySelectorAll(".expense-his-value");
    expenseValueCnt.forEach(child => {
        expenseValuesCnt.removeChild(child);
    })
    user.getData('expenseData').forEach(eachData => {
        const valueDiv = expense_data_template(eachData);
        expenseValuesCnt.appendChild(valueDiv)
    })
}

export const loadExpenseFunction = () => {
    console.log(radioTypeBtn)
    labelDropDown.addEventListener("change", updateLabelValue);
    radioTypeBtn.forEach(btn => {
        btn.addEventListener("click", updateIsIncome)
    });
    expenseForm.addEventListener("submit", addExpense);
}