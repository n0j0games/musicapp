const ACTIVE_SEVERITY = 0;
// 0 = debug, info, warn, error
// 1 = info, warn, error
// 2 = warn, error
// 3 = error only
// 4 = none

export class Logger {

    private readonly className: string;

    constructor(instance: any) {
        this.className = instance.toString();
    }

    public debug(...message: any[]) {
        if (ACTIVE_SEVERITY <= 0) {
            console.log("DEBUG", this.className + "\n",  ...message);
        }
    }

    public log(...message: any[]) {
        this.info(...message);
    }

    public info(...message: any[]) {
        if (ACTIVE_SEVERITY <= 1) {
            console.log("INFO", this.className + "\n", ...message);
        }
    }

    public warn(...message: any[]) {
        if (ACTIVE_SEVERITY <= 2) {
            console.warn("WARNING", this.className + "\n", ...message);
        }
    }

    public error(...message: any[]) {
        if (ACTIVE_SEVERITY <= 3) {
            console.error("ERROR", this.className + "\n", ...message);
        }
    }

}
