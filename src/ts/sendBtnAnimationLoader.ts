import gsap from "gsap";
import { clearForm, sendMessage } from ".";

export default async function initAnimation() {
    const buttonsMain = document.querySelector("#sendMessage") as HTMLButtonElement;
    const animationElementsMain = document.querySelector("#ownMessage") as HTMLDivElement;

    const sponsoringPage = document.querySelector("#sponsoringPage") as HTMLIFrameElement;


    let buttons: HTMLButtonElement[] = [buttonsMain];
    let animationElements: HTMLDivElement[] = [animationElementsMain];
    let docs: Document[] = [document];

    await new Promise<void>((resolve) => {
        sponsoringPage.addEventListener("load", () => {
            resolve();
        }, { once: true });
    });


    const contentDocument = sponsoringPage.contentDocument;
    if (!contentDocument) return;
    const buttonsMain2 = contentDocument.querySelector("#sendMessage") as HTMLButtonElement;
    const animationElementsMain2 = contentDocument.querySelector("#ownMessage") as HTMLDivElement;

    if (buttonsMain2 && animationElementsMain2) {
        buttons.push(buttonsMain2);
        animationElements.push(animationElementsMain2);
        docs.push(sponsoringPage.contentDocument!);
    }

    if (buttons.length === 0 || animationElements.length === 0) return;
    if (!buttons || !animationElements) return;
    console.log(buttons.length);

    for(let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const animationElement = animationElements[i];

        let getVar = (variable: string) => getComputedStyle(button).getPropertyValue(variable);
        button.addEventListener("click", async () => {
            const successSending = await sendMessage(docs[i]);
            if(!successSending)return;
            if (!animationElement.classList.contains("active")) {
                animationElement.classList.add("active");

                gsap.to(animationElement, {
                    keyframes: [
                        {
                            "--left-wing-first-x": 50,
                            "--left-wing-first-y": 100,
                            "--right-wing-second-x": 50,
                            "--right-wing-second-y": 100,
                            duration: 0.2,
                            onComplete() {
                                gsap.set(animationElement, {
                                    "--left-wing-first-y": 0,
                                    "--left-wing-second-x": 40,
                                    "--left-wing-second-y": 100,
                                    "--left-wing-third-x": 0,
                                    "--left-wing-third-y": 100,
                                    "--left-body-third-x": 40,
                                    "--right-wing-first-x": 50,
                                    "--right-wing-first-y": 0,
                                    "--right-wing-second-x": 60,
                                    "--right-wing-second-y": 100,
                                    "--right-wing-third-x": 100,
                                    "--right-wing-third-y": 100,
                                    "--right-body-third-x": 60
                                });
                            }
                        },
                        {
                            "--left-wing-third-x": 20,
                            "--left-wing-third-y": 90,
                            "--left-wing-second-y": 90,
                            "--left-body-third-y": 90,
                            "--right-wing-third-x": 80,
                            "--right-wing-third-y": 90,
                            "--right-body-third-y": 90,
                            "--right-wing-second-y": 90,
                            duration: 0.2
                        },
                        {
                            "--rotate": 50,
                            "--left-wing-third-y": 95,
                            "--left-wing-third-x": 27,
                            "--right-body-third-x": 45,
                            "--right-wing-second-x": 45,
                            "--right-wing-third-x": 60,
                            "--right-wing-third-y": 83,
                            duration: 0.25
                        },
                        {
                            "--rotate": 60,
                            "--plane-x": -8,
                            "--plane-y": 40,
                            duration: 0.2
                        },
                        {
                            "--rotate": 40,
                            "--plane-x": 45,
                            "--plane-y": -300,
                            "--plane-opacity": 0,
                            duration: 0.375,
                            onComplete() {
                                setTimeout(() => {
                                    clearForm(docs[i]);
                                    animationElement.removeAttribute("style");
                                    animationElement.classList.remove("active");
                                    // gsap.fromTo(
                                    //     animationElement,
                                    //     {
                                    //         opacity: 0,
                                    //         y: -8
                                    //     },
                                    //     {
                                    //         opacity: 0,
                                    //         y: 0,
                                    //         clearProps: true,
                                    //         duration: 0.3,
                                    //         onComplete() {
                                    //             animationElement.classList.remove("active");
                                    //         }
                                    //     }
                                    // );
                                }, 1800);
                            }
                        }
                    ]
                });

                gsap.to(animationElement, {
                    keyframes: [
                        {
                            "--text-opacity": 0,
                            "--border-radius": 0,
                            "--left-wing-background": getVar("--primary-dark"),
                            "--right-wing-background": getVar("--primary-dark"),
                            duration: 0.11
                        },
                        {
                            "--left-wing-background": getVar("--primary"),
                            "--right-wing-background": getVar("--primary"),
                            duration: 0.14
                        },
                        {
                            "--left-body-background": getVar("--primary-dark"),
                            "--right-body-background": getVar("--primary-darkest"),
                            duration: 0.25,
                            delay: 0.1
                        },
                        {
                            "--trails-stroke": 171,
                            duration: 0.22,
                            delay: 0.22
                        },
                        {
                            "--success-opacity": 1,
                            "--success-x": 0,
                            duration: 0.2,
                            delay: 0.15
                        },
                        {
                            "--success-stroke": 0,
                            duration: 1
                        }
                    ]
                });
            }
        });
    }
}