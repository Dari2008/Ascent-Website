import { error, isEmailCorrectFormat, isTesting } from ".";

export function initNewsletterBtn(){
    const newsletterBtn = document.getElementById("newsletterBtn") as HTMLButtonElement;
    const emailInput = document.getElementById("emailNewsletter") as HTMLInputElement;
    if(!newsletterBtn || !emailInput)return;
    newsletterBtn.addEventListener("click", async ()=>{
        const email = emailInput.value;

        if(!isEmailCorrectFormat(email)){
            error(emailInput);
            error(newsletterBtn);
            return;
        }

        const response = await (await fetch(isTesting?"http://localhost:2222/ascent/newsletter.php":"/php/newsletter.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "omit",
            body: JSON.stringify({
                email: email
            })
        })).json();

        if(response.success){
            newsletterBtn.classList.add("success");
            emailInput.classList.add("success");
            setTimeout(()=>{
                newsletterBtn.classList.remove("success");
                emailInput.classList.remove("success");
            }, 3000);
        }else{
            alert("Something went wrong.");
            error(emailInput);
            error(newsletterBtn);
        }

    });
}