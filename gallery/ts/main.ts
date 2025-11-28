export type GalleryImage = {
    src: string;
    srct: string;
    title: string;
    width: number;
    height: number;
};


const IMAGES: GalleryImage[] = [];


const IMAGES_TO_SHOW_PRE_BUTTON_PRESS = 20;
const IMAGES_TO_SHOW_AUTO_LOAD = 5;
let index = 0;

let loadedFirst = false;

export async function initGallery() {

    const gallery = document.getElementById("gallery") as HTMLDivElement;

    await initLightGallery();


    window.addEventListener("message", (event) => {
        if (event.data === "startloading" && !loadedFirst) {
            showNextOnes(gallery);
            //@ts-ignore
            // $('#gallery').justifiedGallery('norewind');
            $('#gallery').justifiedGallery({
                rowHeight: rowHeight,
                margins: 15,
                lastRow: 'center',
                captions: true
            });
            loadedFirst = true;
        }
    });

    const heightCalcRowHeight = window.parent ? window.parent.innerHeight/3 : window.innerHeight/3;
    const widthCalcRowHeight = window.parent ? window.parent.innerWidth/3 : window.innerWidth/3;
    const rowHeight = Math.max(heightCalcRowHeight, widthCalcRowHeight);

    const btn = document.getElementById("loadMore") as HTMLButtonElement;
    if("ontouchstart" in window || navigator.maxTouchPoints || window.matchMedia("(pointer: coarse)").matches) {
        btn.addEventListener("click", () => {
            showNextOnes(gallery);
            //@ts-ignore
            $('#gallery').justifiedGallery('norewind');
            if (index >= IMAGES.length) {
                btn.style.display = "none";
            }
        });
    }else{
        btn.style.display = "none";
        $(window).on("scroll", function() {
            const scrollTop = $(window).scrollTop()!;
            const windowHeight = $(window).height()!;
            const docHeight = $(document).height()!;

            if (scrollTop + windowHeight === docHeight) {
                add(
                    IMAGES.slice(
                        index,
                        Math.min(index + IMAGES_TO_SHOW_AUTO_LOAD, IMAGES.length)
                    ),
                    gallery
                );
                index += IMAGES_TO_SHOW_AUTO_LOAD;
                //@ts-ignore
                $('#gallery').justifiedGallery('norewind');
            }
        });
    }

    // @ts-ignore
    // $('#gallery').justifiedGallery({
    //     rowHeight: rowHeight,
    //     margins: 15,
    //     lastRow: 'center',
    //     captions: true
    // });





}
initGallery();

function showNextOnes(gallery: HTMLDivElement) {
    add(
        IMAGES.slice(
            index,
            Math.min(index + IMAGES_TO_SHOW_PRE_BUTTON_PRESS, IMAGES.length)
        ),
        gallery
    );


    index += IMAGES_TO_SHOW_PRE_BUTTON_PRESS;
}

async function initLightGallery() {
    const data = await (await fetch("./galleryImages.json")).json() as GalleryImage[];

    const shuffle = function(arr: any[]) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    };

    shuffle(data);

    IMAGES.push(...data);

}


function add(data: GalleryImage[], gallery: HTMLDivElement) {
    const bigImagePercentage = 0.1;
    const random = (min: number, max: number) => Math.random() * (max - min) + min;
    for (const image of data) {
        const img = document.createElement("img");
        img.src = image.src;
        img.alt = image.title;
        img.loading = "lazy";
        img.classList.add("gallery-image");
        img.setAttribute("data-src", image.src);
        img.setAttribute("data-sub-html", image.title);
        const a = document.createElement("a");

        if(random(0, 100) < bigImagePercentage*100) {
            const width = image.width;
            const height = image.height;
            const aspectRatio = width / height;
            const randomMultiplier = random(1.2, 1.6);
            const newWidth = Math.floor(width * randomMultiplier);
            const newHeight = width / aspectRatio;
            img.setAttribute("width", newWidth.toString());
            img.setAttribute("height", newHeight.toString());
        }

        a.classList.add("gallery-image");
        a.href = image.src;
        a.appendChild(img);
        gallery.appendChild(a);
    }
}