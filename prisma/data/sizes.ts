import { WeightClass } from "@prisma/client";

export const dogSizes = [
    {
        weightClass: WeightClass.SMALL,
        weightImperialMin: 0,
        weightImperialMax: 24,
        weightImperialAvg: 12,
        weightMetricMin: 0,
        weightMetricMax: 10.9,
        weightMetricAvg: 5.5,
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
        weightMetricMin: 10.9,
        weightMetricMax: 25.9,
        weightMetricAvg: 18.4,
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
        weightMetricMin: 25.9,
        weightMetricMax: 44.9,
        weightMetricAvg: 35.4,
        levelOneDegreeRangeSize: 5,
        levelTwoDegreeRangeSize: 20,
        levelThreeDegreeRangeSize: 5,
        noColdRiskFarenheitTemp: 45,
        dangerColdRiskFarenheitTemp: 14
    }
];
