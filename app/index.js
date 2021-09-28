import clock from "clock";
import * as document from "document";
import { HeartRateSensor } from "heart-rate";
import { battery, charger } from "power";
import { display } from "display";
import { me as appbit } from "appbit";
import { today } from "user-activity";

let minutehand = document.getElementById("minutehand");

// Update the clock every minute
clock.granularity = "minutes";

clock.ontick = (evt) => {
   // set position of minutes-hand
   let degree = (evt.date.getHours() * 15) + (evt.date.getMinutes() * .25) - 180;
   minutehand.groupTransform.rotate.angle = degree;
};

if (HeartRateSensor) {
   const heartLabel = document.getElementById("heart-label");
   const hrm = new HeartRateSensor();
   hrm.addEventListener("reading", () => {
      heartLabel.text = hrm.heartRate;
   });
   // Automatically stop the sensor when the screen is off to conserve battery.
   display.addEventListener("change", () => {
      display.on ? hrm.start() : hrm.stop();
   });
   hrm.start();
}

if (appbit.permissions.granted("access_activity")) {
   const stepsLabel = document.getElementById("steps-label");
   stepsLabel.text = Math.floor(today.adjusted.steps / 1000, 0) + "k";
}

const powerLabel = document.getElementById("power-label");
const powerSymbol = (battery.charging ? "+" : "%");
powerLabel.text = Math.floor(battery.chargeLevel) + powerSymbol;

const dayLabel = document.getElementById("day-label");

const d = new Date();
let weekday = new Array(7);
weekday[0] = "S";
weekday[1] = "M";
weekday[2] = "T";
weekday[3] = "W";
weekday[4] = "D";
weekday[5] = "F";
weekday[6] = "S";

const n = weekday[d.getDay()];
dayLabel.text = n + "" + d.getDate();
