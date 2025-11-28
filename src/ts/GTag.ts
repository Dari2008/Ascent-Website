export async function initGTag(parent: HTMLElement){
    initGTM(parent);
    // const script = document.createElement("script");
    // script.async = true;
    // script.src = "";
    // parent.appendChild(script);
    gtag(['js', new Date()]);
    gtag({
    });
    gtag(['config', 'G-QF4XZL2S52', { debug_mode: false }]);

    // const script = await (await fetch("https://www.googletagmanager.com/gtag/js?id=G-QF4XZL2S52")).text();
    // if(script){
    //     eval(script);
    // }

}

export function initGTM(parent: HTMLElement){
    eval(`(function (w, d, s, l, i) {
    w[l] = w[l] || []; 
    w[l].push({
        'gtm.start': new Date().getTime(), event: 'gtm.js'
    }); 
    var f = d.getElementsByTagName(s)[0];
    var j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; 
    j.async = true; 
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; 
    if(!f){
        d.head.appendChild(j);
    }else{
        f.parentNode.insertBefore(j, f);
    }
    })(window, document, 'script', 'dataLayer', 'GTM-KP68B24P');`);

    const noscript = document.createElement("noscript");
    noscript.classList.add("noElement");

    const iframe = document.createElement("iframe");
    iframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-KP68B24P";
    iframe.height = 0 + "";
    iframe.width = 0 + "";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    noscript.appendChild(iframe);

    parent.appendChild(iframe);
    
    eval(`
        window.addEventListener("message", (e)=>{
            if(e.data){
                const data = e.data;
                if(data.googleTagManager){
                    const GTMData = data.data;
                    // @ts-ignore
                    dataLayer.push(GTMData);
                }
            }
        });
    `);

}

// type CustomWindow = Window & {
//     dataLayer?: any[];
// }

export function gtag(args: (({[key: string]: any})|(any[]))){
    const cookieConsent = localStorage.getItem("cookieConsent");
    if(cookieConsent){
        const parsed = JSON.parse(cookieConsent);
        if(!parsed.analyticsCookies && !parsed.all){
            return;
        }
    }
    // (window as CustomWindow).dataLayer = (window as CustomWindow).dataLayer || [];
    // (window as CustomWindow).dataLayer?.push(args);

    if(typeof args === "object")(args as any)["date"] = new Date().toISOString();

    window.postMessage({googleTagManager: true, data: args}, "*");
}

const navigatedTo = (name: string)=>{
    gtag({
        event: 'pageView',
        pageName: name
    });
}

var startedTime = 0;

const startViewing = ()=>{
    startedTime = Date.now();
}

const stopViewing = (name: string)=>{
    const time = Date.now() - startedTime;
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor(time / 60000) - hours * 60;
    const seconds = Math.floor(time / 1000) - minutes * 60 - hours * 3600;
    gtag({
        event: 'viewTime',
        pageName: name,
        timeHours : hours,
        timeMinutes: minutes,
        timeSeconds: seconds
    });
    startedTime = 0;
}

const clickedSocialMedia = (name: string)=>{
    gtag({
        event: 'clickedSocialMedia',
        socialMedia: name
    });
}

const allowCookies = ()=>{
    gtag({
        event: 'allowAllCookies'
    });
}

const denyCookies = ()=>{
    gtag({
        event: 'denyAllCookies'
    });
}

const allowAnalytics = ()=>{
    gtag({
        event: 'allowAnalytics'
    });
}

const denyAnalytics = ()=>{
    gtag({
        event: 'denyAnalytics'
    });
}

const cookiePreferences = (prefs: {[key: string]: boolean})=>{
    gtag({
        event: 'cookiePreferences',
        preferences: prefs
    });
}

export default {
    clickedSocialMedia,
    stopViewing,
    startViewing,
    navigatedTo,
    allowCookies,
    denyCookies,
    allowAnalytics,
    denyAnalytics,
    cookiePreferences
};