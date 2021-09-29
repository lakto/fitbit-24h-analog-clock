import { me as appbit } from "appbit";
import { BodyPresenceSensor } from "body-presence";
import clock from "clock";
import { display } from "display";
import * as document from "document";
import { HeartRateSensor } from "heart-rate";
import { battery, charger } from "power";
import { today } from "user-activity";

// definitions firs
const weekday = new Array(7);
weekday[0] = "Su";
weekday[1] = "Mo";
weekday[2] = "Tu";
weekday[3] = "We";
weekday[4] = "Th";
weekday[5] = "Fr";
weekday[6] = "Sa";

const minuteHand = document.getElementById("minute-hand");
const heartLabel = document.getElementById("heart-label");
const stepsLabel = document.getElementById("steps-label");
const dateLabel = document.getElementById("date-label");
const powerLabel = document.getElementById("power-label");

displayPower();
displaySteps();

// Update the clock every minute
clock.granularity = "minutes";
clock.ontick = (evt) => {
   // set position of minutes-hand
   let degree = (evt.date.getHours() * 15) + (evt.date.getMinutes() * .25) - 180;
   minuteHand.groupTransform.rotate.angle = degree;

   displayPower();
   displaySteps();
};

// heart rate
if (HeartRateSensor) {

   let hrm = new HeartRateSensor();
   hrm.addEventListener("reading", () => {
      heartLabel.text = hrm.heartRate + " ♥";
   });

   let body = new BodyPresenceSensor();
   body.addEventListener("reading", () => {
      if (!body.present) {
         hrm.stop();
         heartLabel.text = "--";
      } else {
         hrm.start();
      }
   });
   body.start();

}

// update view of steps and power if display is on
display.addEventListener("change", () => {
   if (display.on) {
      // update steps
      displaySteps();

      // update power
      displayPower();
   }
});

charger.addEventListener("change", () => {
   displayPower();
});

// weekday and day
const d = new Date();
const n = weekday[d.getDay()];
dateLabel.text = n + " " + d.getDate();

function displayPower() {
   const powerSymbol = (battery.charging ? " ++" : "%");
   powerLabel.text = Math.floor(battery.chargeLevel) + powerSymbol;
}

function displaySteps() {
   if (appbit.permissions.granted("access_activity")) {
      stepsLabel.text = Math.floor((today.adjusted.steps / 1000) * 100) / 100 + "k";
   }
}