import { endpoint } from "./endpoint.js";
import { displayPopup } from "./popup.js";
import { user } from "./user_data.js"

const alertInp = document.querySelector("#alert-inp");
const updateAlertUI = () => {
    alertInp.value = user.getData('alert');
}

export const send_usage_alert = async () => {
    const pending_amount = user.getData('balance');
    const alert = user.getData('alert');
    if((user.getData('is_send')) || alert < pending_amount){
        return ;
    }
    const total_amount = user.getData('totalAmount');
    const percentage = 100 - ((pending_amount / total_amount) * 100);
    const date = document.querySelector(".from-date-disp span").innerText;
    const bodyData = {
        total_amount,
        pending_amount,
        percentage,
        date,
        is_send: true
    }

    const res = await fetch(endpoint.alert, {
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
        user.setData('is_send', true);
    }
}

let is_update_progress = false;
const updateAlertBtn = document.querySelector(".update-alert-btn");
const loadingAlertUI = document.querySelector(".updating-alert");
const updateAlert = async (e) => {
    e.preventDefault();
    if(user.getData("timestamp") === 0){
        displayPopup("Please update your total Income");
        return;
    }
    if(is_update_progress){
        return ;
    }
    loadingAlertUI.classList.remove("none");
    is_update_progress = true;
    const pending_amount = +user.getData('balance');
    const amount = +(alertInp.value);
    const updateIsSend = amount < pending_amount ? false : true;
    const bodyData = {
        amount,
        is_send: updateIsSend
    }
    const res = await fetch(endpoint.alert, {
        method:"PUT",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    });   
    if(res.status === 200){
        user.setData('alert', amount);
        user.setData('is_send', updateIsSend);
    }
    loadingAlertUI.classList.add("none");
    is_update_progress = false;
} 

export const loadAlertFunction = () => {
    updateAlertUI();
    updateAlertBtn.addEventListener("click", updateAlert);
}