import { Directive, EventEmitter, HostListener, Input, Output, Renderer, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { MaskGenerator } from '../interfaces/mask-interface';

@Directive({
  selector: '[spMask]'
})
export class MaskDirective {

  private static readonly ALPHA = 'A';
  private static readonly NUMERIC = '9';
  private static readonly ALPHANUMERIC = '?';
  private static readonly R = 'R';
  private static readonly T = 'T';
  private static readonly REGEX_MAP = new Map([
    [MaskDirective.ALPHA, /\w/],
    [MaskDirective.NUMERIC, /\d/],
    [MaskDirective.ALPHANUMERIC, /\w|\d/],
    [MaskDirective.R, /[R]/],
    [MaskDirective.T, /[T]/]
  ]);

  private value: string = null;
  private displayValue: string = null;

  @Input('spMask')
  public maskGenerator: MaskGenerator;

  @Input('spKeepMask')
  public keepMask: boolean;

  @Input('spMaskValue')
  public set maskValue(value: string) {
    if (value !== this.value) {
      this.value = value;
      this.defineValue();
    }
  };

  @Output('spMaskValueChange')
  public changeEmitter = new EventEmitter<string>();

  @HostListener('input', ['$event'])
  public onInput(event: { target: { value?: string } }): void {
    let target = event.target;
    let value = target.value;
    this.onValueChange(value);
  }

  constructor(private ngControl: NgControl, private renderer: Renderer, private el: ElementRef) { }

  private updateValue(value: string) {
    this.value = value;
    this.changeEmitter.emit(value);
    MaskDirective.delay().then(
      () => this.ngControl.control.updateValueAndValidity()
    );
  }

  private defineValue() {
    let value: string = this.value;
    let displayValue: string = null;

    if (this.maskGenerator) {
      let mask = this.maskGenerator.generateMask(value);

      if (value != null) {
        displayValue = MaskDirective.mask(value, mask);
        value = MaskDirective.processValue(displayValue, mask, this.keepMask);
      }
    } else {
      displayValue = this.value;
    }

    MaskDirective.delay().then(() => {
      if (this.displayValue !== displayValue) {
        this.displayValue = displayValue;
        this.ngControl.control.setValue(displayValue);
        return MaskDirective.delay();
      }
    }).then(() => {
      if (value != this.value) {
        return this.updateValue(value);
      }
    });
  }

  private onValueChange(newValue: string) {
    let start = this.el.nativeElement.selectionStart;
    let end = this.el.nativeElement.selectionEnd;
    if (newValue !== this.displayValue) {
      let displayValue = newValue;
      let value = newValue;

      if ((newValue == null) || (newValue.trim() === '')) {
        value = null;
      } else if (this.maskGenerator) {
        let mask = this.maskGenerator.generateMask(newValue);
        displayValue = MaskDirective.mask(newValue, mask);
        value = MaskDirective.processValue(displayValue, mask, this.keepMask);
      }

      this.displayValue = displayValue;
      if (newValue !== displayValue) {
        this.ngControl.control.setValue(displayValue);
        if (displayValue.length > start) {
          let char = displayValue.charAt(start - 1);
          if (this.value && this.value.length >= displayValue.length) {//char deletion
            this.renderer.selectRootElement(this.el).nativeElement.setSelectionRange(start, end);
          } else { //char addition
            if (char === ' ' || char === '/' || char === '-') {
              const diff = displayValue.length - start;
              this.renderer.selectRootElement(this.el).nativeElement.setSelectionRange(start + diff, end + diff);
            } else {
              this.renderer.selectRootElement(this.el).nativeElement.setSelectionRange(start, end);
            }
          }
        }
      }

      if (value !== this.value) {
        this.updateValue(value);
      }
    }
  }

  private static processValue(displayValue: string, mask: string, keepMask: boolean) {
    let value = keepMask ? displayValue : MaskDirective.unmask(displayValue, mask);
    return value
  }

  private static mask(value: string, mask: string): string {
    value = value.toString();

    let len = value.length;
    let maskLen = mask.length;
    let pos = 0;
    let newValue = '';

    for (let i = 0; i < Math.min(len, maskLen); i++) {
      let maskChar = mask.charAt(i);
      let newChar = value.charAt(pos).toLocaleUpperCase();
      let regex: RegExp = MaskDirective.REGEX_MAP.get(maskChar);

      if (regex) {
        pos++;

        if (regex.test(newChar)) {
          newValue += newChar;
        } else {
          i--;
          len--;
        }
      } else {
        if (maskChar === newChar) {
          pos++;
        } else {
          len++;
        }

        newValue += maskChar;
      }
    }

    return newValue;
  }

  private static unmask(maskedValue: string, mask: string): string {
    let maskLen = (mask && mask.length) || 0;
    return maskedValue.split('').filter(
      (currChar, idx) => (idx < maskLen) && MaskDirective.REGEX_MAP.has(mask[idx])
    ).join('');
  }

  private static delay(ms: number = 0): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => null);
  }
}
