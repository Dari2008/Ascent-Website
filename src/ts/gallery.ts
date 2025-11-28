export function loadImages(){
    const gallery = document.getElementById("galleryPage") as HTMLIFrameElement;
    gallery?.contentWindow?.postMessage("startloading", "*");
}