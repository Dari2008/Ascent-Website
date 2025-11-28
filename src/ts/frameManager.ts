import { startCarReveal, stopCarReveal } from "./carRevealPage";
import { loadImages } from "./gallery";
import { convertPathToId, navigateTo, Path } from "./navigation";

const title = document.title || "Ascent";

export function initFooter(){
    const imprint = document.getElementById("impressum") as HTMLDivElement;
    const privacy = document.getElementById("datenschutzrichtlinie") as HTMLDivElement;

    imprint.addEventListener("click", openImpressum);
    privacy.addEventListener("click", openPrivacy);
}

function openImpressum(){
    const otherPages = document.getElementById("otherPages") as HTMLDivElement;
    otherPages.classList.add("open");

    const impressumIframe = document.getElementById("impressumFrame") as HTMLIFrameElement;
    openIFrame(otherPages, impressumIframe);
}


function openPrivacy(){
    const otherPages = document.getElementById("otherPages") as HTMLDivElement;
    otherPages.classList.add("open");

    const impressumIframe = document.getElementById("policyFrame") as HTMLIFrameElement;
    openIFrame(otherPages, impressumIframe);
}

export function openPage(page: Path, addToHistory: boolean = true){
    const iframe = document.getElementById(convertPathToId(page)) as HTMLIFrameElement;
    openIFrameFromContext(iframe);

    if(page === "/theCar"){
        startCarReveal();
    }

    if(page === "/gallery"){
        loadImages();
    }

    if(addToHistory)navigateTo(page);
}

function openIFrameFromContext(iframe: HTMLIFrameElement, animate: boolean = true){
    const width = iframe.getBoundingClientRect().width;
    const height = iframe.getBoundingClientRect().height;
    const left = iframe.getBoundingClientRect().left;
    const top = iframe.getBoundingClientRect().top;

    iframe.style.setProperty("--top", top + "px");
    iframe.style.setProperty("--left", left + "px");
    iframe.style.setProperty("--width", width + "px");
    iframe.style.setProperty("--height", height + "px");

    const parent = iframe.parentElement;
    if(parent){
        parent.style.setProperty("--width", width + "px");
        parent.style.setProperty("--height", height + "px");
    }
    
    if(animate)iframe.classList.add("open");
    setTimeout(() => {
        iframe.classList.add("opened");
    }, 100);

    iframe.addEventListener("transitionend", () => {
        iframe.classList.remove("open");
        iframe.contentDocument?.documentElement.classList.add("visible");
    }, { once: true });

}

function openIFrame(otherPages: HTMLDivElement, iframe: HTMLIFrameElement){
    const run = ()=>{
        iframe.classList.remove("hidden");
        iframe.classList.add("open");
        
        document.title = iframe.contentDocument?.title ?? "Ascent";
        window.parent.postMessage({"type": "setTitle", "title": document.title}, "*");

        iframe.contentDocument?.getElementById("close")?.addEventListener("click", () => {
            iframe.addEventListener("transitionend", () => {
                otherPages.classList.remove("open");
                iframe.classList.add("hidden");
            });
            iframe.classList.remove("open");
        });
    };
    if(iframe.contentDocument?.readyState === "complete"){
        run();
    }else{
        // Play Loading animation
        iframe.addEventListener("load", () => {
            run();
        });
    }
}

async function closeIframeFromContext(){
    return new Promise<void>((resolve) => {
        const iframes = document.querySelectorAll("iframe.opened") as NodeListOf<HTMLIFrameElement>;

        const promises: Promise<void>[] = [];

        for(const iframe of iframes) {
            
            iframe.classList.add("close");
            iframe.classList.remove("opened");
            promises.push(new Promise<void>((resolve) => {
                iframe.addEventListener("transitionend", () => {
                    iframe.classList.remove("close");
                    iframe.style.removeProperty("--top");
                    iframe.style.removeProperty("--left");
                    iframe.style.removeProperty("--width");
                    iframe.style.removeProperty("--height");

                    const parent = iframe.parentElement;
                    if(parent){
                        parent.style.removeProperty("--width");
                        parent.style.removeProperty("--height");
                    }
                    resolve();
                }, { once: true });
            }));
            iframe.contentDocument?.documentElement?.classList.remove("visible");
            iframe.contentWindow?.scrollTo(0, 0);

        }

        Promise.all(promises).then(() => {
            resolve();
        })
    });
}

export async function closeOtherPages(addToHistory: boolean = true){
    if(addToHistory)navigateTo("/home");
    const otherPages = document.getElementById("otherPages") as HTMLDivElement;
    otherPages.classList.remove("open");
    const iframes = otherPages.getElementsByTagName("iframe");
    for(let i = 0; i < iframes.length; i++){
        iframes[i].classList.remove("open");
        iframes[i].classList.add("hidden");
        iframes[i].contentDocument?.documentElement?.classList.remove("visible");
    }
    stopCarReveal();
    document.title = title;
    window.parent.postMessage({"type": "setTitle", "title": document.title}, "*");
    await closeIframeFromContext();
    // await new Promise(resolve => setTimeout(resolve, 100));
}
