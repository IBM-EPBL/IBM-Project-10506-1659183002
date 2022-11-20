let id;
export function displayPopup(msg){
    const popup = document.querySelector(".popup");
    clearTimeout(id);
    popup.innerText = msg;
    popup.classList.remove("none");
    id = setTimeout(() => {
        popup.innerText = '';
        popup.classList.add("none");
        popup.classList.add("none");
    }, 3000);
}