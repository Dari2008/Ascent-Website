import { PageData } from "./autoSelectTitle";

export function initNavigation(){
    // window.addEventListener("popstate", function(event) {
    //     const state = event.state;
    //     console.log(state);
    // });

    window.addEventListener("message", function(event) {
        if(event.data == null || event.data.type === undefined) return;
        if(event.data.type === "popstate") {
            const data = event.data.data;
            if(data == null || data == undefined)return;
            window.dispatchEvent(new PopStateEvent("popstate", {
                state: data
            }));
        }
    });

    navigateTo("/home");
}

export function navigateTo(path: Path){
    const data: PageData = {
        path: path,
        type: "pageData"
    };
    window.parent?.postMessage({
        type: "navigateTo",
        data: data,
        path: path.replace("/", "")
    }, "*");
    // window.history.pushState({}, "asdasd", "");
}

export type Path = "/home" | "/aboutUs" | "/whatIsStemracing" | "/theCar" | "/sponsorings" | "/gofundme" | "/gallery";

export const PATH_TO_ID:
{[key: string]: Path} = {
    whatIsStemRacingPage: "/whatIsStemracing",
    aboutUsPage: "/aboutUs",
    theCarPage: "/theCar",
    sponsoringPage: "/sponsorings",
    gofundmePage: "/gofundme",
    galleryPage: "/gallery",
}

export function convertIdToPath(id: string): Path {
    if(id in PATH_TO_ID){
        return PATH_TO_ID[id];
    } else {
        console.warn(`No path found for id: ${id}`);
        return "/home";
    }
}

export function convertPathToId(path: Path): string {
    const id = Object.keys(PATH_TO_ID).find(key => PATH_TO_ID[key] === path);
    if(id){
        return id;
    } else {
        console.warn(`No id found for path: ${path}`);
        return "homePage";
    }
}

export function getIframeFromPageData(data: PageData): HTMLIFrameElement | null {
    const iframe = document.getElementById(convertPathToId(data.path)) as HTMLIFrameElement;
    if(iframe){
        return iframe;
    } else {
        console.warn(`No iframe found for path: ${data.path}`);
        return null;
    }
}