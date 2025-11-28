function onloaded(){
    const frontTire = document.getElementById("frontTire");
    const backTire = document.getElementById("backTire");
    const car = document.getElementById("car");

    const rotationPerSecondFrontTire = 0.5;
    const rotationPerSecondBackTire = 0.5;
    const rotationPerSecondBackTireStart = 1 - rotationPerSecondBackTire;

    const rotationFrontTire = 0;
    const rotationBackTire = 0;

    frontTire.style.transformOrigin = "50% 50%";
    backTire.style.transformOrigin = "50% 50%";

    setInterval(() => {
        frontTire.style.setProperty("--rotation", rotationFrontTire + "deg");
        backTire.style.setProperty("--rotation", rotationBackTire + "deg");
        rotationFrontTire += rotationPerSecondFrontTire;
        rotationBackTire += rotationPerSecondBackTire + rotationPerSecondBackTireStart;

        rotationPerSecondBackTireStart *= 0.2;

        if(rotationPerSecondBackTireStart < 0.05){
            rotationPerSecondBackTireStart = 0;
        }

        rotationFrontTire = rotationFrontTire % 360;
        rotationBackTire = rotationBackTire % 360;
    }, 1000/60);

}

// window.onload = onloaded;