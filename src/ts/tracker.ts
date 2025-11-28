import { v4 as uuidv4 } from "uuid";
import { isTesting } from ".";
import DeviceDetector from "device-detector-js";

class Tracker {
    constructor(private uuid: string, private firstTime: boolean = true){
    }

    private init(){
        if(this.firstTime)this.sendTrack(TrackType.PAGE_VIEWED_FIRST_TIME);
        else this.sendTrack(TrackType.PAGE_VIEWED_AGAIN);
    }

    public checkFirstViewed(){
        this.init();
    }

    public async sendTrack(tracktype: TrackType, otherData: any = undefined){
        const userAgent = new DeviceDetector().parse(navigator.userAgent);
        let browserName = userAgent.client?.name;
        const osName = userAgent.os?.name;
        const desktopName = userAgent.device?.brand + " " + userAgent.device?.type;

        if(
            desktopName === "null null"
            || desktopName === "undefined undefined"
            || desktopName === "undefined"
            || desktopName === ""
            || osName === "null null"
            || osName === "undefined undefined"
            || osName === "undefined"
            || osName === ""
            || browserName === "null null"
            || browserName === "undefined undefined"
            || browserName === "undefined"
            || browserName === ""
        ) {
            browserName = window.navigator.userAgent;
        }

        fetch(isTesting?"http://localhost:2222/ascent/tr.php":"/php/tr.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "omit",
            body: JSON.stringify({
                uuid: this.uuid,
                tracktype: tracktype,
                browserName: browserName,
                osName: osName,
                desktopName: desktopName,
                otherData: userAgent,
                ...otherData
            })
        });
    }

}

export enum TrackType {
    "PAGE_VIEWED_FIRST_TIME",
    "PAGE_VIEWED_AGAIN",
    "CONTACT_FORMULAR_SENT",
    "VIEW_TIME",
    "TIME_TAKEN_FOR"
}

export enum PageViewType {
    "CARREVEAL", "COMPETITION", "ABOUTUS", "SPONSORING", "CONTACT", "IMPRESSUM"
}

const isFirstTime = localStorage.getItem("tr") === null;

const TRACKER: Tracker = new Tracker(generateTrackerUUID(), isFirstTime);

export default TRACKER;



function generateTrackerUUID(): string{
    const val = localStorage.getItem("tr");
    const uuid = uuidv4();
    if(!val){
        localStorage.setItem("tr", uuidv4());
        return uuid;
    }
    return val;
}
