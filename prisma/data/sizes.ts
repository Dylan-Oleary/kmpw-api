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
        levelOneDegreeRangeSize: 10,
        levelTwoDegreeRangeSize: 15,
        levelThreeDegreeRangeSize: 5,
        noColdRiskFarenheitTemp: 55,
        dangerColdRiskFarenheitTemp: 24
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
        levelOneDegreeRangeSize: 5,
        levelTwoDegreeRangeSize: 15,
        levelThreeDegreeRangeSize: 15,
        noColdRiskFarenheitTemp: 50,
        dangerColdRiskFarenheitTemp: 14
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
        levelOneDegreeRangeSize: 5,
        levelTwoDegreeRangeSize: 20,
        levelThreeDegreeRangeSize: 5,
        noColdRiskFarenheitTemp: 45,
        dangerColdRiskFarenheitTemp: 14
    }
];
