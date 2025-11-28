import { CURRENT_LANGUAGE, languages, setLanguage, updateElement } from "./languageElement";

export default function initLanguageChooser(){
    const languageChooser = document.querySelector("#languageToggle") as HTMLDivElement;
    const english = document.querySelector(".english") as HTMLDivElement;
    const german = document.querySelector(".german") as HTMLDivElement;

    if(!languageChooser || !english || !german)return;

    english.addEventListener("click", onEnglishClick);
    german.addEventListener("click", onGermanClick);
}

function onEnglishClick(e: Event){
    e.preventDefault();
    (document.querySelector("#languageToggle") as HTMLDivElement).setAttribute("lang", "en");
    setLanguage(languages.English);
    updateAll();
}

function onGermanClick(e: Event){
    e.preventDefault();
    (document.querySelector("#languageToggle") as HTMLDivElement).setAttribute("lang", "de");
    setLanguage(languages.German);
    updateAll();
}

export function updateAll(){
    const all = document.querySelectorAll("*[langPath]");
    for(const element of all){
        if(!(element instanceof HTMLElement))continue;
        const path = element.getAttribute("langPath");
        if(!path)continue;
        updateElement(element, path);
    }
    updatePlaceholders();
    updateCountdown();
    updateDocumentElement();
    updateAllIframes();
}

function updateAllIframes(){
    const iframes = document.querySelectorAll("iframe");
    for(const iframe of iframes){
        updateIFrame(iframe as HTMLIFrameElement);
    }
}

function updateIFrame(iframe: HTMLIFrameElement){
    const all = iframe.contentDocument?.querySelectorAll("*[langPath]");
    if(all)for(const element of all){
        const path = element.getAttribute("langPath");
        if(!path)continue;
        updateElement(element as HTMLElement, path);
    }

    const allPlaceholders = iframe.contentDocument?.querySelectorAll("*[placeholderPath]");
    if(allPlaceholders)for(const element of allPlaceholders){
        const langElement = element as HTMLInputElement|HTMLTextAreaElement;
        const path = langElement.getAttribute("placeholderPath");
        langElement.placeholder = CURRENT_LANGUAGE.translationXML?.getTranslation(path || "") || "";
    }

    const iframes = iframe.contentDocument?.querySelectorAll("iframe");
    if(iframes)for(const childIframe of iframes){
        updateIFrame(childIframe as HTMLIFrameElement);
    }

}

function updateDocumentElement(){
    const iframes = document.querySelectorAll("iframe");
    for(const iframe of iframes){
        const doc = (iframe as HTMLIFrameElement).contentDocument;
        if(doc){
            doc.documentElement.lang = CURRENT_LANGUAGE.code;
        }
    }
    document.documentElement.lang = CURRENT_LANGUAGE.code;
}

function updatePlaceholders(){
    const all = document.querySelectorAll("*[placeholderPath]");
    for(const element of all){
        const langElement = element as HTMLInputElement|HTMLTextAreaElement;
        const path = langElement.getAttribute("placeholderPath");
        langElement.placeholder = CURRENT_LANGUAGE.translationXML?.getTranslation(path || "") || "";
    }
}

function updateCountdown(){
    const countdownEmbed = document.querySelector("#countdownEmbed") as HTMLEmbedElement;
    const d = countdownEmbed.getSVGDocument();
    const days = d?.getElementById("days");
    const hours = d?.getElementById("hours");
    const minutes = d?.getElementById("minutes");
    const seconds = d?.getElementById("seconds");

    if(days && hours && minutes && seconds){
        days.innerHTML = CURRENT_LANGUAGE.translationXML?.getTranslation("countdown.days") || "";
        hours.innerHTML = CURRENT_LANGUAGE.translationXML?.getTranslation("countdown.hours") || "";
        minutes.innerHTML = CURRENT_LANGUAGE.translationXML?.getTranslation("countdown.minutes") || "";
        seconds.innerHTML = CURRENT_LANGUAGE.translationXML?.getTranslation("countdown.seconds") || "";
    }
}