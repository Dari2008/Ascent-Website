export function initExtraPrices(){
    const extraPrices = document.getElementById("extraPrices") as HTMLUListElement;
    const elements = extraPrices.querySelectorAll("li") as NodeListOf<HTMLLIElement>;
    const prices = Array.from(elements).map((el) => {
        return {
            element: el,
            name: el.getAttribute("data-name") as string,
            url: el.getAttribute("data-url") as string
        };
    });

    for(let element of prices){
        element.element.addEventListener("click", () => {
            showImageFullSize(element.url);
        });
    }

}


export function showImageFullSize(image: HTMLImageElement|string){
    const imageFullScreenDiv = document.getElementById("imageFullScreen") as HTMLDivElement;
    const imageFullScreen = imageFullScreenDiv.querySelector("img") as HTMLImageElement;
    imageFullScreen.src = typeof image === "string"?image:image.src;
    imageFullScreenDiv.classList.add("show");
    imageFullScreenDiv.classList.remove("showImage");


    imageFullScreen.addEventListener("load", () => {
        requestAnimationFrame(function() {
            setTimeout(() => {
                imageFullScreenDiv.classList.add("showImage");
            }, 200);
        });
    });

    imageFullScreenDiv.addEventListener("click", (e) => {
        if(e.target === imageFullScreenDiv){
            imageFullScreenDiv.classList.remove("show");
        }

    });

}