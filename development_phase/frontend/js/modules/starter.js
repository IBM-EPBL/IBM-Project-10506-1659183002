import { updateExpenseData } from './expense.js';
import { updateBalance, updateSplitData } from './income.js';
import { user } from './user_data.js';
export const loadData = () => {
    updateBalance();
    document.querySelector("#income").value = user.getData("totalAmount");
    const date = new Date(user.getData("timestamp"));
    console.log(date, user.getData('timestamp'))
    const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    document.querySelector(".from-date-disp span").innerText = dateStr
    updateSplitData();
    updateExpenseData(user.getData('expenseData'));
}