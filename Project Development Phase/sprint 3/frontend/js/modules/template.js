export const split_data_template = (split_data) => {
    if(!split_data){
        return;
    }
    const div = document.createElement("div");
    div.classList.add("split-value");
    div.dataset.value = split_data.LABEL;
    div.innerHTML =`<div class="split-label no-overflow">${split_data.LABEL}</div>
                    <div class="split-amount no-overflow">${split_data.AMOUNT}</div>
                    <div class="split-balance no-overflow">${split_data.balance}</div>
                    <div class="split-alert no-overflow">alert</div>
                    <div class="split-edit">
                        <div class="split-delete-ic"><img src="./assets/delete.svg" alt="delete-split"></div>
                    </div>`
    return div;
};

export const expense_data_template = (expense_data) => {
    const div = document.createElement("div");
    div.classList.add("expense-his-value");
    div.dataset.id = expense_data.TIMESTAMP;
    const date = new Date(expense_data.TIMESTAMP)
    const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    const timeStr = `${date.getHours()}:${date.getMinutes()}`
    div.innerHTML =`<div class="expense-value-label">${expense_data.LABEL}</div>
                    <div class="expense-value-date">
                        <div class="date-date">${dateStr}</div>
                        <div class="date-time">${timeStr}</div>
                    </div>
                    <div class="expense-value-amount ${expense_data.IS_INCOME ? 'positive' : 'negative'}">Rs. ${expense_data.AMOUNT}</div>`
    return div;
}