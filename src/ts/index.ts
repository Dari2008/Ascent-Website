export const isTesting = false;

import { NavData, PageData, selectNavElement, setupAutoChanger, TITLE_DATA } from "./autoSelectTitle";
import { closeOtherPages, initFooter, openPage } from "./frameManager";
import GTAG, { initGTag } from "./GTag";
import { initHamburgerMenu } from "./hamburgermenu";
import { initExtraPrices } from "./imageFullSize";
import initLanguageChooser from "./languageChooser";
import { initNavigation } from "./navigation";
import { initNewsletterBtn } from "./newsletter";
import { seeMoreBtns } from "./seeMoreBtns";
import initAnimation from "./sendBtnAnimationLoader";
import TRACKER from "./tracker";

for(const navitem of TITLE_DATA){
    const btn = document.getElementById(navitem.navId);
    const footerBtn = document.getElementById(navitem.footerId);
    const mobileBtn = document.getElementById(navitem.mobileNavId);
    if(!btn)continue;
    btn.onclick = async () => {
        await closeOtherPages(false);
        const element = document.getElementById(navitem.elementId);
        scrollIntoView(element?element:undefined); 
        selectNavElement(navitem);
        navigatedTo(navitem);
        GTAG.navigatedTo(navitem.trackerId);
    };
    if(footerBtn)footerBtn.onclick = btn.onclick;
    if(mobileBtn)mobileBtn.onclick = ()=>{
        btn.click();
        document.getElementById("icon")?.click();
    };

    if(navitem.isHome){
        if(btn){
            btn.click();
        }
    }

}

initNavigation();
seeMoreBtns();
initLanguageChooser();
initAnimation();
initHistoryManager();
setupAutoChanger();
initNewsletterBtn();
initHamburgerMenu();
initExtraPrices();
initFooter();
initGTag(document.body);
GTAG.startViewing();
TRACKER.checkFirstViewed();

function scrollIntoView(e: HTMLElement|undefined, scrollType: string = "top"){
    if(!e)return;
    const content = document.querySelector("#navBar");
    const boundingRect = e.getBoundingClientRect();
    const contentRect = content?.getBoundingClientRect();
    let top = 0;
    if(boundingRect.top != 0){
        top = Math.max(boundingRect.top + window.scrollY - (contentRect?(contentRect.height>120?0:contentRect.height):0), 0);
    }

    const windowHeight = window.outerHeight;
    const selfHeight = e.clientHeight;

    let y = top;
    if(scrollType === "center"){
        y = top - (windowHeight/2 - selfHeight/2) + 5;
    }else if(scrollType === "top"){
        y = top;
    }else if(scrollType === "bottom"){
        y = top - windowHeight + selfHeight;
    }

    scrollToY(y);
}

function scrollToY(y: number){
    window.scrollTo({
        left: 0,
        top: y
    });
}

function initHistoryManager(){
    window.addEventListener("popstate", async (e) => {
        const state = e.state as NavData|PageData;
        if(state.type == "navData"){
            await closeOtherPages(false);
            let targetElement: HTMLElement|null = document.getElementById(state.elementId);
            if(targetElement) {
                const boundingRect = targetElement.getBoundingClientRect();
                const top = boundingRect.top + window.scrollY;
                scrollToY(top);
            }
        }else{
            if(state.path == "/home"){
                closeOtherPages(false);
            }else{
                if(state && state.path){
                    openPage(state.path, false);
                }
            }
            // if(state.path === "/home"){
            // }else{
            // }
        }
    });
}


function navigatedTo(id: NavData){
    window.parent?.postMessage({
        type: "navigateTo",
        data: id,
        path: ""
    }, "*");
}

export function clearForm(doc: Document){
    const name = doc.querySelector("#name") as HTMLInputElement;
    const email = doc.querySelector("#email") as HTMLInputElement;
    const message = doc.querySelector("#message") as HTMLInputElement;
    if(name)name.value = "";
    if(email)email.value = "";
    if(message)message.value = "";
}

export async function sendMessage(doc: Document): Promise<boolean>{
    let wasSmthWrong = false;
    const nameE = doc.querySelector("#name") as HTMLInputElement;
    const emailE = doc.querySelector("#email") as HTMLInputElement;
    const messageE = doc.querySelector("#message") as HTMLInputElement;

    const name = nameE.value;
    const email = emailE.value;
    const message = messageE.value;
    if(!isNameCorrectFormat(name)){
        wasSmthWrong = true;
        error(nameE);
    }

    if(!isEmailCorrectFormat(email)){
        wasSmthWrong = true;
        error(emailE);
    }

    if(!isMessageCorrectFormat(message)){
        wasSmthWrong = true;
        error(messageE);
    }
    if(wasSmthWrong)return false;
    const result = await (await fetch((isTesting?"http://localhost:2222/ascent/send.php":"/php/send.php"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "omit",
        body: JSON.stringify({
            email,
            name,
            message
        })
    })).json();

    if(result.success){
        return true;
    }else{
        return false;
    }
}

export function isNameCorrectFormat(name: string){
    return name.length > 3 && name.length < 50;
}

export function isEmailCorrectFormat(email: string){
    return email.length > 5 && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/.test(email);
}

export function isMessageCorrectFormat(message: string){
    return message.length > 10 && message.length < 500;
}

export function error(e: HTMLElement){
    e.classList.add("error");
    e.addEventListener("keydown", removeError);
}

function removeError(e: Event){
    if(e.target){
        const element = e.target as HTMLInputElement;
        if(element.classList.contains("error")){
            element.classList.remove("error");
        }
        element.removeEventListener("input", removeError);
    }
}