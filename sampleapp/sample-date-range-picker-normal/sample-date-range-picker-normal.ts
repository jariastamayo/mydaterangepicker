import {Component, OnInit} from '@angular/core';
import {IMyDrpOptions, IMyDateRangeModel, IMyDateRange, IMyInputFieldChanged, IMyCalendarViewChanged, IMyDateSelected} from '../../src/my-date-range-picker/interfaces';

declare var require:any;
const sampleDrpNormalTemplate: string = require('./sample-date-range-picker-normal.html');

@Component({
    selector: 'sample-date-range-picker-normal',
    template: sampleDrpNormalTemplate
})

export class SampleDateRangePickerNormal implements OnInit {

    private myDateRangePickerOptionsNormal: IMyDrpOptions = {
        dateFormat: 'mm/dd/yyyy',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        height: '34px',
        width: '250px',
        inline: false,
        alignSelectorRight: false,
        indicateInvalidDateRange: true,
        minYear: 1970,
        maxYear: 2200,
        componentDisabled: false,
        showClearDateRangeBtn: true,
        showSelectorArrow: true,
        disableHeaderButtons: true,
        showWeekNumbers: false,
        showClearBtn: true,
        showApplyBtn: true,
        showSelectDateText: true,
        openSelectorOnInputClick: false,
        monthSelector: true,
        yearSelector: true,
        disableDateRanges: [
            {beginDate: {year: 2016, month: 10, day: 5}, endDate: {year: 2016, month: 10, day: 7}},
            {beginDate: {year: 2016, month: 10, day: 10}, endDate: {year: 2016, month: 10, day: 12}}
        ]
    };

    //selectedDateRangeNormal:string = '04 Nov 2016 - 26 Nov 2016';
    selectedDateRangeNormal:IMyDateRange = {beginDate: {year: 2018, month: 10, day: 9}, endDate: {year: 2018, month: 10, day: 19}};

    selectedTextNormal: string = '';
    border: string = 'none';

    placeholderTxt: string = '';

    constructor() {
        console.log('constructor(): SampleDateRangePickerNormal');
    }

    clearDateRange() {
        this.selectedDateRangeNormal = null;
    }

    onDisableComponent(checked: boolean) {
        let copy = this.getCopyOfOptions();
        copy.componentDisabled = checked;
        this.myDateRangePickerOptionsNormal = copy;
    }

    onEditableDateField(checked: boolean) {
        let copy = this.getCopyOfOptions();
        copy.editableDateRangeField = checked;
        copy.openSelectorOnInputClick = !checked;
        this.myDateRangePickerOptionsNormal = copy;
    }

    onAlignSelectorRight(checked: boolean) {
        let copy = this.getCopyOfOptions();
        copy.alignSelectorRight = checked;
        this.myDateRangePickerOptionsNormal = copy;
    }

    onShowClearButton(checked: boolean) {
        let copy = this.getCopyOfOptions();
        copy.showClearDateRangeBtn = checked;
        this.myDateRangePickerOptionsNormal = copy;
    }

    onShowPlaceholderText(checked: boolean) {
        this.placeholderTxt = checked ? 'Select a date range' : '';
    }

    onDisableHeaderButtons(checked: boolean) {
        let copy = this.getCopyOfOptions();
        copy.disableHeaderButtons = checked;
        this.myDateRangePickerOptionsNormal = copy;
    }

    onShowWeekNumbers(checked: boolean) {
        let copy = this.getCopyOfOptions();
        copy.showWeekNumbers = checked;
        this.myDateRangePickerOptionsNormal = copy;
    }

    onDisableToday(checked:boolean) {
        let date = new Date();

        // Disable/enable today
        let copy = this.getCopyOfOptions();
        copy.disableDates = checked ? [{year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()}] : [];
        this.myDateRangePickerOptionsNormal = copy;
    }

    onShowClearBtn(checked: boolean) {
        let copy = this.getCopyOfOptions();
        copy.showClearBtn = checked;
        this.myDateRangePickerOptionsNormal = copy;
    }

    onShowApplyBtn(checked: boolean) {
        let copy = this.getCopyOfOptions();
        copy.showApplyBtn = checked;
        this.myDateRangePickerOptionsNormal = copy;
    }

    onShowSelectDateText(checked: boolean) {
        let copy = this.getCopyOfOptions();
        copy.showSelectDateText = checked;
        this.myDateRangePickerOptionsNormal = copy;
    }

    onMonthSelector(checked: boolean) {
        let copy = this.getCopyOfOptions();
        copy.monthSelector = checked;
        this.myDateRangePickerOptionsNormal = copy;
    }

    onYearSelector(checked: boolean) {
        let copy = this.getCopyOfOptions();
        copy.yearSelector = checked;
        this.myDateRangePickerOptionsNormal = copy;
    }

    ngOnInit() {
        console.log('onInit(): SampleDateRangePickerNormal');
    }

    onDateRangeChanged(event: IMyDateRangeModel) {
        console.log('onDateRangeChanged(): Begin: ', event.beginDate, ' - beginJsDate: ', new Date(event.beginJsDate).toLocaleDateString(), ' - End: ', event.endDate, ' - endJsDate: ', new Date(event.endJsDate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - beginEpoc timestamp: ', event.beginEpoc, ' - endEpoc timestamp: ', event.endEpoc);
        if(event.formatted !== '') {
            this.selectedTextNormal = 'Formatted: ' + event.formatted;
            this.border = '1px solid #CCC';

            this.selectedDateRangeNormal = {beginDate: event.beginDate, endDate: event.endDate};
        }
        else {
            this.selectedTextNormal = '';
            this.border = 'none';
        }
    }

    onInputFieldChanged(event: IMyInputFieldChanged) {
        console.log('onInputFieldChanged(): Value: ', event.value, ' - dateRangeFormat: ', event.dateRangeFormat, ' - valid: ', event.valid);
    }

    onCalendarViewChanged(event: IMyCalendarViewChanged) {
        console.log('onCalendarViewChanged(): Year: ', event.year, ' - month: ', event.month, ' - first: ', event.first, ' - last: ', event.last);
    }

    onDateSelected(event: IMyDateSelected) {
        console.log('onDateSelected(): Value: ', event);
    }

    getCopyOfOptions(): IMyDrpOptions {
        return JSON.parse(JSON.stringify(this.myDateRangePickerOptionsNormal));
    }
}