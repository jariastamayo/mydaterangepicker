import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { MyDateRangePicker } from "./my-date-range-picker.component";
import { FocusDirective } from "./directives/my-date-range-picker.focus.directive";
import { MaskDirective } from "./directives/mask.directive";

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [MyDateRangePicker, FocusDirective, MaskDirective],
    exports: [MyDateRangePicker, FocusDirective, MaskDirective]
})
export class MyDateRangePickerModule { }
