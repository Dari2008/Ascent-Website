import { Path } from "./navigation";

export type NavData = {
    trackerId: string;
    navId: string;
    elementId: string;
    footerId: string;
    mobileNavId: string;
    isHome?: boolean;
    type: "navData";
};

export type PageData = {
    path: Path;
    type: "pageData";
}

export const TITLE_DATA: NavData[] = [
    {
        "trackerId": "home",
        "navId": "homeBtn",
        "elementId": "carReveal",
        "footerId": "footerHome",
        "mobileNavId": "homeBtnMobile",
        "type": "navData",
        "isHome": true
    },
    {
        "trackerId": "stemRacing",
        "navId": "competitionBtn",
        "elementId": "whatIsStemRacing",
        "footerId": "footerCompetition",
        "mobileNavId": "competitionBtnMobile",
        "type": "navData"
    },
    {
        "trackerId": "aboutUs",
        "navId": "aboutUsBtn",
        "elementId": "aboutUsText",
        "footerId": "footerAboutUs",
        "mobileNavId": "aboutUsBtnMobile",
        "type": "navData"
    },
    {
        "trackerId": "theCar",
        "navId": "theCarBtn",
        "elementId": "theCar",
        "footerId": "footerTheCar",
        "mobileNavId": "theCarBtnMobile",
        "type": "navData"
    },
    {
        "trackerId": "sponsoring",
        "navId": "sponsoringBtn",
        "elementId": "gofundme",
        "footerId": "footerSponsoring",
        "mobileNavId": "sponsoringBtnMobile",
        "type": "navData"
    },
    {
        "trackerId": "sponsoring",
        "navId": "sponsoringBtn",
        "elementId": "sponsorings",
        "footerId": "footerSponsoring",
        "mobileNavId": "sponsoringBtnMobile",
        "type": "navData"
    },
    {
        "trackerId": "news",
        "navId": "newsBtn",
        "elementId": "news",
        "footerId": "footerNews",
        "mobileNavId": "newsBtnMobile",
        "type": "navData"
    },
    {
        "trackerId": "contact",
        "navId": "contactBtn",
        "elementId": "contact",
        "footerId": "footerContact",
        "mobileNavId": "contactBtnMobile",
        "type": "navData"
    }
];



let currentScroll: null|((e: Event|undefined) => void) = null;
export function setupAutoChanger(){
    // currentLink = link;
    const elements = TITLE_DATA.map(e=>document.getElementById(e.elementId));
    if(currentScroll){
        window.removeEventListener("scroll", currentScroll);
    }

    currentScroll = (e: Event|undefined)=>{
        const isMobile = document.body?document.body.style.getPropertyValue("--mobile") === "1":false;
        const carReveal = document.getElementById(TITLE_DATA[0].elementId);
        if(e)if(!e.isTrusted)return;
        if(elements.length === 0)return;
        const visibe = TITLE_DATA.map(e=>{
            if (!e) return false;
            const element = document.getElementById(e.elementId);
            if(!element)return false;
                const bounding = element.getBoundingClientRect();
                const boundingCarReveal = carReveal?.getBoundingClientRect();
                let centerY = window.innerHeight * (isMobile?(1/4):(1/2));
            if(boundingCarReveal){
                centerY = boundingCarReveal.height/2;
            }
            return bounding.top < centerY && bounding.bottom > centerY;
        });
        if(visibe.length <= 0)return;
            let firstIndexTrue = visibe.indexOf(true);
        if(firstIndexTrue === -1){
            selectNavElement(TITLE_DATA[TITLE_DATA.length-1]);
            return;
        }else{
            selectNavElement(TITLE_DATA[firstIndexTrue]);
        }
    };
    currentScroll(undefined);
    window.addEventListener("scroll", currentScroll);
    init();
}

export function selectNavElement(name: NavData|HTMLElement){
    let titleElement: HTMLElement|null = name as HTMLElement;
    if(name instanceof HTMLElement){
        titleElement = name;
    }else{
        titleElement = document.getElementById(name.navId);
    }

    let info = TITLE_DATA.find(e=>e.navId === titleElement?.id);
    if(info){
        const mobileNavElement = document.getElementById(info.mobileNavId);
        if(mobileNavElement){
            const mobileNavElements = document.querySelectorAll(".navButtonMobile");
            mobileNavElements.forEach(e=>e.classList.remove("selected"));
            mobileNavElement.classList.add("selected");
        }
    }
        
    const elements = TITLE_DATA.map(e=>document.getElementById(e.navId));

    const slideUnderline = document.querySelector("#slideUnderline") as HTMLDivElement;
    if(!slideUnderline)return;
    if(!titleElement)return;
    elements.forEach(e=>e?.classList.remove("selected"));
    titleElement.classList.add("selected");
    slideUnderline.style.left = titleElement.getBoundingClientRect().left + "px";
    slideUnderline.style.width = titleElement.getBoundingClientRect().width + "px";
}

export function init(){
    const slideUnderline = document.querySelector("#slideUnderline") as HTMLDivElement;

    const navBarheight = document.getElementById("navBar")?.getBoundingClientRect().height??0;

    const maxHeight = Math.max(...TITLE_DATA.map(e=>document.getElementById(e.navId)?.getBoundingClientRect().height??0));
    const top = navBarheight/2 + maxHeight/2;
    slideUnderline.style.top = top + "px";
}