import { isValueOfType } from "@theonlydevsever/utilities";

class SafetyIndexService {
    private _safetyIndex = 1;

    constructor() {}

    public get safetyIndex(): number {
        return this._safetyIndex;
    }

    private set safetyIndex(newIndex: number) {
        if (!isValueOfType(newIndex, "number")) {
            throw new Error("Safety index must be a number");
        }

        this._safetyIndex = newIndex >= 0 ? Math.floor(newIndex) : 0;
    }
}

export default SafetyIndexService;
export { SafetyIndexService };
