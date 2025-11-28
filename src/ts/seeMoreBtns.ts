import { openPage } from "./frameManager";
import { convertIdToPath } from "./navigation";

export function seeMoreBtns() {
    const btns = document.querySelectorAll('.readMore');
    for(const btn of btns) {
        btn.addEventListener('click', () => {
            openPage(convertIdToPath(btn.getAttribute('pageId') || ""));
        });
    }
}