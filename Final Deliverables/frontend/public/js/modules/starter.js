import { updateExpenseData } from './expense.js';
import { updateBalance, updateSplitData } from './income.js';
import { displayPopup } from './popup.js';
import { user } from './user_data.js';
export const loadData = () => {
    const nav = document.querySelector("nav");
    const main = document.querySelector("main");
    const loading = document.querySelector(".loading");
    nav.classList.remove("none");
    main.classList.remove("none");
    loading.classList.add("none");


    updateBalance();
    document.querySelector("#income").value = user.getData("totalAmount");
    const timestamp = user.getData("timestamp");
    if(timestamp)
    {
        const date = new Date(user.getData("timestamp"));
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        document.querySelector(".from-date-disp span").innerText = dateStr;
    }
    else{
        displayPopup("Please update your total Income");
    }
    updateSplitData();
    updateExpenseData(user.getData('expenseData'));
}