export function startCarReveal(){
    const iframe = document.querySelector("#theCarPage") as HTMLIFrameElement;
    const video = iframe.contentDocument?.getElementById("carReveal") as HTMLVideoElement;
    if(!video)return;
    video.play();
    const element = iframe.contentDocument?.querySelector(".headerDiv .headerImage.img") as HTMLImageElement;
    element.style.display = "none";
}

export function stopCarReveal(){
    const iframe = document.querySelector("#theCarPage") as HTMLIFrameElement;
    const video = iframe.contentDocument?.getElementById("carReveal") as HTMLVideoElement;
    if(!video)return;
    video.pause();
    const element = iframe.contentDocument?.querySelector(".headerDiv .headerImage.img") as HTMLImageElement;
    element.style.display = "block";
}