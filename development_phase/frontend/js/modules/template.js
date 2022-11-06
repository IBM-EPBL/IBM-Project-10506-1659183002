export const split_data_template = (split_data) => {
    const div = document.createElement("div");
    div.classList.add("split-value");
    div.dataset.id = split_data.ID;
    div.innerHTML =`<div class="split-label no-overflow">${split_data.LABEL}</div>
                    <div class="split-amount no-overflow">${split_data.AMOUNT}</div>
                    <div class="split-balance no-overflow">balance</div>
                    <div class="split-alert no-overflow">alert</div>
                    <div class="split-edit">
                        <div class="split-delete-ic"><img src="./assets/delete.svg" alt="delete-split"></div>
                    </div>`
    return div;
};
