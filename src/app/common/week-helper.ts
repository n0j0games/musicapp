export class WeekHelper {

    public static getCurrentDateWeek(): number {
        // Copying date so the original date won't be modified
        const tempDate = new Date(Date.now());

        // ISO week date weeks start on Monday, so correct the day number
        const dayNum = (new Date(Date.now()).getDay() + 6) % 7;

        // Set the target to the nearest Thursday (current date + 4 - current day number)
        tempDate.setDate(tempDate.getDate() - dayNum + 3);

        // ISO 8601 week number of the year for this date
        const firstThursday = tempDate.valueOf();

        // Set the target to the first day of the year
        // First set the target to January 1st
        tempDate.setMonth(0, 1);

        // If this is not a Thursday, set the target to the next Thursday
        if (tempDate.getDay() !== 4) {
            tempDate.setMonth(0, 1 + ((4 - tempDate.getDay()) + 7) % 7);
        }

        // The weeknumber is the number of weeks between the first Thursday of the year
        // and the Thursday in the target week
        return 1 + Math.ceil((firstThursday - tempDate.valueOf()) / 604800000); // 604800000 = number of milliseconds in a week
    }


    public static getFridayOfWeek(week : number | undefined, year : number | undefined) {
        if (week === undefined || year === undefined) {
            return Date.now().toLocaleString("de-DE");
        }
        const dayOfYear : number = (1 + (week - 1) * 7); // 1st of January + 7 days for each week
        const friday : Date = new Date(year, 0, dayOfYear + (year == 2024 ? 4 : 2));
        return friday.toLocaleDateString("de-DE");
    }

}