import { selectNavigator, showPage } from "../../utilsTs/Navigator";
import { preloadImpressum } from "../../utilsTs/Preloader";
import WebPageStartScript from "../../utilsTs/WebPageStartScript";


const webPage: WebPageStartScript = {
    NAME: "impressum",
    LINK: "//impressum/index.html",
    onFirstLoad() {
        showPage();
    },
    onFirstPageLoaded() {
        selectNavigator(null);
        showPage();
    },
    onLoad() {
    },
    onUnload() {
        
    },
    async onPreload(){
        await preloadImpressum();
    }
};

export default webPage;