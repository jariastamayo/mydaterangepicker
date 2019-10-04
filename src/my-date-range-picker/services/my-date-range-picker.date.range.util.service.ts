import { Injectable } from "@angular/core";
import { IMyDateRange } from "../interfaces/my-date-range.interface";
import { IMyMonthLabels } from "../interfaces/my-month-labels.interface";
import { IMyDate } from "../interfaces/my-date.interface";
import { IMyMonth } from "../interfaces/my-month.interface";

@Injectable()
export class DateRangeUtilService {
    public isDateRangeValid(daterange: string, dateFormat: string, minYear: number, maxYear: number, disableUntil: IMyDate, disableSince: IMyDate, disableDates: Array<IMyDate>, disableDateRanges: Array<IMyDateRange>, enableDates: Array<IMyDate>, monthLabels: IMyMonthLabels): IMyDateRange {
        let invalidDateRange: IMyDateRange = {
            beginDate: {day: 0, month: 0, year: 0},
            endDate: {day: 0, month: 0, year: 0}
        };
        let isMonthStr: boolean = dateFormat.indexOf("mmm") !== -1;

        if (daterange.length !== 21 && !isMonthStr || daterange.length !== 25 && isMonthStr) {
            return invalidDateRange;
        }

        let dates: Array<string> = daterange.split("-");
        if (dates.length !== 2) {
            return invalidDateRange;
        }

        let validDates: Array<IMyDate> = [];

        for (let i in dates) {
            let date: IMyDate = this.isDateValid(dates[i], dateFormat, minYear, maxYear, monthLabels, isMonthStr);
            if (date.day === 0 && date.month === 0 && date.year === 0) {
                return invalidDateRange;
            }
            if (this.isDisabledDay(date, minYear, maxYear, disableUntil, disableSince, disableDates, disableDateRanges, enableDates)) {
                return invalidDateRange;
            }
            validDates.push(date);
        }

        if (this.getTimeInMilliseconds(validDates[1]) < this.getTimeInMilliseconds(validDates[0])) {
            return invalidDateRange;
        }

        // Valid date range
        return {
            beginDate: {day: validDates[0].day, month: validDates[0].month, year: validDates[0].year},
            endDate: {day: validDates[1].day, month: validDates[1].month, year: validDates[1].year}
        };
    }

    public isMonthLabelValid(monthLabel: string, monthLabels: IMyMonthLabels): number {
        for (let key = 1; key <= 12; key++) {
            if (monthLabel.toLowerCase() === monthLabels[key].toLowerCase()) {
                return key;
            }
        }
        return -1;
    }

    public isYearLabelValid(yearLabel: number, minYear: number, maxYear: number): number {
        if (yearLabel >= minYear && yearLabel <= maxYear) {
            return yearLabel;
        }
        return -1;
    }

    public parseDatePartNumber(dateFormat: string, dateString: string, datePart: string): number {
        let pos: number = dateFormat.indexOf(datePart);
        if (pos !== -1) {
            let value: string = dateString.substring(pos, pos + datePart.length);
            if (!/^\d+$/.test(value)) {
                return -1;
            }
            return parseInt(value);
        }
        return -1;
    }

    public parseDatePartMonthName(dateFormat: string, dateString: string, datePart: string, monthLabels: IMyMonthLabels): number {
        let pos: number = dateFormat.indexOf(datePart);
        if (pos !== -1) {
            return this.isMonthLabelValid(dateString.substring(pos, pos + datePart.length), monthLabels);
        }
        return -1;
    }

    public parseDefaultMonth(monthString: string): IMyMonth {
        let month: IMyMonth = {monthTxt: "", monthNbr: 0, year: 0};
        if (monthString !== "") {
            let split: Array<string> = monthString.split(monthString.match(/[^0-9]/)[0]);
            month.monthNbr = split[0].length === 2 ? parseInt(split[0]) : parseInt(split[1]);
            month.year = split[0].length === 2 ? parseInt(split[1]) : parseInt(split[0]);
        }
        return month;
    }

    public isDisabledDay(date: IMyDate, minYear: number, maxYear: number, disableUntil: IMyDate, disableSince: IMyDate, disableDates: Array<IMyDate>, disableDateRanges: Array<IMyDateRange>, enableDates: Array<IMyDate>): boolean {
        let dateMs: number = this.getTimeInMilliseconds(date);
        for (let d of enableDates) {
            if (d.year === date.year && d.month === date.month && d.day === date.day) {
                return false;
            }
        }

        if (date.year < minYear && date.month === 12 || date.year > maxYear && date.month === 1) {
            return true;
        }

        if (this.isInitializedDate(disableUntil) && dateMs <= this.getTimeInMilliseconds(disableUntil)) {
            return true;
        }
        if (this.isInitializedDate(disableSince) && dateMs >= this.getTimeInMilliseconds(disableSince)) {
            return true;
        }
        for (let d of disableDates) {
            if (d.year === date.year && d.month === date.month && d.day === date.day) {
                return true;
            }
        }
        for (let d of disableDateRanges) {
            if (this.isInitializedDate(d.beginDate) && this.isInitializedDate(d.endDate) && dateMs >= this.getTimeInMilliseconds(d.beginDate) && dateMs <= this.getTimeInMilliseconds(d.endDate)) {
                return true;
            }
        }
        return false;
    }

    public isMonthDisabledByDisableUntil(date: IMyDate, disableUntil: IMyDate): boolean {
        return this.isInitializedDate(disableUntil) && this.getTimeInMilliseconds(date) <= this.getTimeInMilliseconds(disableUntil);
    }

    public isMonthDisabledByDisableSince(date: IMyDate, disableSince: IMyDate): boolean {
        return this.isInitializedDate(disableSince) && this.getTimeInMilliseconds(date) >= this.getTimeInMilliseconds(disableSince);
    }

    public isInitializedDate(date: IMyDate): boolean {
        return date.year !== 0 && date.month !== 0 && date.day !== 0;
    }

    public getTimeInMilliseconds(date: IMyDate): number {
        return new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0).getTime();
    }

    public getWeekNumber(date: IMyDate): number {
        let d: Date = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
        d.setDate(d.getDate() + (d.getDay() === 0 ? -3 : 4 - d.getDay()));
        return Math.round(((d.getTime() - new Date(d.getFullYear(), 0, 4).getTime()) / 86400000) / 7) + 1;
    }

    private isDateValid(date: string, dateFormat: string, minYear: number, maxYear: number, monthLabels: IMyMonthLabels, isMonthStr: boolean): IMyDate {
        let daysInMonth: Array<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let invalidDate: IMyDate = {day: 0, month: 0, year: 0};

        if (date.length !== 10 && !isMonthStr || date.length !== 11 && isMonthStr) {
            return invalidDate;
        }

        let separator: string = dateFormat.replace(/[dmy]/g, "")[0];

        let parts: Array<string> = date.split(separator);
        if (parts.length !== 3) {
            return invalidDate;
        }

        let day: number = this.parseDatePartNumber(dateFormat, date, "dd");
        let month: number = isMonthStr ? this.parseDatePartMonthName(dateFormat, date, "mmm", monthLabels) : this.parseDatePartNumber(dateFormat, date, "mm");
        let year: number = this.parseDatePartNumber(dateFormat, date, "yyyy");

        if (day !== -1 && month !== -1 && year !== -1) {
            if (year < minYear || year > maxYear || month < 1 || month > 12) {
                return invalidDate;
            }

            if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                daysInMonth[1] = 29;
            }

            if (day < 1 || day > daysInMonth[month - 1]) {
                return invalidDate;
            }

            // Valid date
            return {day: day, month: month, year: year};
        }
        return invalidDate;
    }
}