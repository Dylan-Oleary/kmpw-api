import { WeightClass } from "@prisma/client";
import convert from "convert-units";

export const dogSizes = [
    {
        weightClass: WeightClass.SMALL,
        weightImperialMin: 0,
        weightImperialMax: 24,
        weightImperialAvg: 12,
        get weightMetricMin() {
            return Number(convert(this.weightImperialMin).from("lb").to("kg").toFixed(1));
        },
        get weightMetricMax() {
            return Number(convert(this.weightImperialMax).from("lb").to("kg").toFixed(1));
        },
        get weightMetricAvg() {
            return Number(((this.weightMetricMin + this.weightMetricMax) / 2).toFixed(1));
        },
        coldSafetyLevelOneFarenheitTemp: 55,
        coldSafetyLevelTwoFarenheitTemp: 45,
        coldSafetyLevelThreeFarenheitTemp: 30,
        coldSafetyLevelFourFarenheitTemp: 25,
        coldSafetyLevelFiveFarenheitTemp: 0
    },
    {
        weightClass: WeightClass.MEDIUM,
        weightImperialMin: 24,
        weightImperialMax: 57,
        weightImperialAvg: 40.5,
        get weightMetricMin() {
            return Number(convert(this.weightImperialMin).from("lb").to("kg").toFixed(1));
        },
        get weightMetricMax() {
            return Number(convert(this.weightImperialMax).from("lb").to("kg").toFixed(1));
        },
        get weightMetricAvg() {
            return Number(((this.weightMetricMin + this.weightMetricMax) / 2).toFixed(1));
        },
        coldSafetyLevelOneFarenheitTemp: 50,
        coldSafetyLevelTwoFarenheitTemp: 45,
        coldSafetyLevelThreeFarenheitTemp: 30,
        coldSafetyLevelFourFarenheitTemp: 15,
        coldSafetyLevelFiveFarenheitTemp: 0
    },
    {
        weightClass: WeightClass.LARGE,
        weightImperialMin: 57,
        weightImperialMax: 99,
        weightImperialAvg: 78,
        get weightMetricMin() {
            return Number(convert(this.weightImperialMin).from("lb").to("kg").toFixed(1));
        },
        get weightMetricMax() {
            return Number(convert(this.weightImperialMax).from("lb").to("kg").toFixed(1));
        },
        get weightMetricAvg() {
            return Number(((this.weightMetricMin + this.weightMetricMax) / 2).toFixed(1));
        },
        coldSafetyLevelOneFarenheitTemp: 45,
        coldSafetyLevelTwoFarenheitTemp: 40,
        coldSafetyLevelThreeFarenheitTemp: 20,
        coldSafetyLevelFourFarenheitTemp: 15,
        coldSafetyLevelFiveFarenheitTemp: 0
    }
];
