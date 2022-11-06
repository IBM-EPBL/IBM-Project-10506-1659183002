import { updateBalance, updateSplitData } from './income.js';
import { user } from './user_data.js';
export const loadData = () => {
    const balance = user.getData('balance');
    updateBalance(balance);
    document.querySelector("#income").value = user.getData("totalAmount");
    updateSplitData(user.getData('splitData'));
}