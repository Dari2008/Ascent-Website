import { navigateTo, selectNavigator, showPage } from "../../utilsTs/Navigator";
import { preloadPolicy } from "../../utilsTs/Preloader";
import WebPageStartScript from "../../utilsTs/WebPageStartScript";


const webPage: WebPageStartScript = {
    NAME: "policy",
    LINK: "//policy/index.html",
    onFirstLoad() {
        showPage();
    },
    onFirstPageLoaded() {
        selectNavigator(null);
        showPage();
    },
    onLoad() {
        window.addEventListener("message", (e)=>{
            if("pressed" in e.data){
                if(e.data.pressed == "contact"){
                    navigateTo("/contact/index.html", false, "contact");
                }
                if(e.data.pressed == "home"){
                    navigateTo("/index.html", false, "home");
                }
            }
        });
        // const contactA = document.getElementById("contactA") as HTMLAnchorElement;
        // contactA.addEventListener("click", ()=>{
        //     navigateTo("/contact/index.html", false, "contact");
        // });
    },
    onUnload() {
        
    },
    async onPreload(){
        await preloadPolicy();
    }
};

export default webPage;