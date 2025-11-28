import { updateAll } from "./languageChooser";

let promisWhenLoaded: Promise<void> = new Promise<void>(() => {
});

export class LanguageElement extends HTMLSpanElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const path = this.getAttribute('path');
        if (!path) {
            this.innerHTML = "No path provided";
            return;
        }

        if(!CURRENT_LANGUAGE){
            await promisWhenLoaded;
        }

        if(!CURRENT_LANGUAGE.translationXML)return;
        this.innerHTML = CURRENT_LANGUAGE.translationXML?.getTranslation(path);
    }

    static get observedAttributes() {
        return ['path'];
    }

    reloadLanguage() {
        const path = this.getAttribute('path');
        if (!path) {
            this.innerHTML = "No path provided";
            return;
        }
        if(!CURRENT_LANGUAGE.translationXML)return;
        this.innerHTML = CURRENT_LANGUAGE.translationXML?.getTranslation(path);
    }
  

}

export async function updateElement(element: HTMLElement, path: string){
        if (!path) {
            element.innerHTML = "No path provided";
            return;
        }

        if(!CURRENT_LANGUAGE){
            await promisWhenLoaded;
        }
        if(!CURRENT_LANGUAGE.translationXML)return;
        element.innerHTML = CURRENT_LANGUAGE.translationXML?.getTranslation(path);
}

export default async function parseLangs(): Promise<void> {
    return new Promise(async (resolve) => {
        for(const lang in languages){
            const langObj = languages[lang as keyof typeof languages];
            if(langObj.translationXML || !langObj.translationURL){
                continue;
            }
            await fetch(langObj.translationURL)
                .then(response => response.text())
                .then(data => {
                    langObj.translationXML = new LanguageXML(data, langObj);
                })
                .catch(error => {
                    console.error("Error loading language file:", error);
                });
        }
        resolve();
    });
}

export function setLanguage(lang: Language) {
    CURRENT_LANGUAGE = lang;
}

export class LanguageXML {

    constructor(xml: string, private lang: Language) {
        const parser = new DOMParser();
        this.xmlDoc = parser.parseFromString(xml.trim(), "text/xml");
    }

    xmlDoc: Document;

    getTranslation(path: string): string {
        const elements = path.split(".");
        let currentElement: Element|null = this.xmlDoc?.querySelector(this.lang.code + " " + elements.join(" "));
        if(!currentElement)return "";
        return currentElement.innerHTML || "";
    }

}

export type Language = {
    name: string;
    code: string;
    translationXML?: LanguageXML;
    translationURL?: string;
}

export const languages: {
    English: Language;
    German: Language;
} = {
    "English": {
        name: "English",
        code: "en",
        translationURL: "./lang/en.xml"
    },
    "German": {
        name: "German",
        code: "de",
        translationURL: "./lang/de.xml"
    }
};


promisWhenLoaded = parseLangs();
customElements.define('lang-element', LanguageElement, { extends: 'span' });
export var CURRENT_LANGUAGE: Language = window.location.hostname.endsWith(".de") ? languages.German : languages.English;
(document.querySelector("#languageToggle") as HTMLDivElement).setAttribute("lang", window.location.hostname.endsWith(".de") ? "de" : "en");

async function showTranslations(){
    await promisWhenLoaded;
    updateAll();
}
showTranslations();