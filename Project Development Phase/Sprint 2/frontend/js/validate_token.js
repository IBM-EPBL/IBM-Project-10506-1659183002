const msgCnt = document.querySelector(".confirm-msg");

const successTemplate = "<p>E-Mail verfied</p><a href='./index.html'>Home</a>"
const verify_email = async (token) => {
    const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "token": token
        })
    })
    // const data = res.json();
    // console.log(res.status)
    if(res.status == 200){
        msgCnt.innerHTML = successTemplate;
        return;
    }
    msgCnt.innerHTML = "Verification Failed Resend Email";
}

window.addEventListener("load", () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');
    verify_email(token);
})