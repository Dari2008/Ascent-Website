export function initHamburgerMenu(){
    const icon = document.getElementById("icon");
    const icona = document.getElementById("a");
    const iconb = document.getElementById("b");
    const iconc = document.getElementById("c");
    icon?.addEventListener("click", ()=>{
        icona?.classList.toggle('a');
        iconb?.classList.toggle('c');
        iconc?.classList.toggle('b');
    });
}