jest.mock('minimal-shared/utils', () => ({
  transformValue: (v: any) => v ?? '',
  transformValueOnBlur: (v: any) => v,
  transformValueOnChange: (v: any) => v,
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
  varAlpha: () => 'rgba(0,0,0,0.1)',
}));

import { Field } from './fields';
import { RHFSlider } from './rhf-slider';
import { RHFRating } from './rhf-rating';
import { RHFTextField } from './rhf-text-field';
import { RHFRadioGroup } from './rhf-radio-group';
import { RHFAutocomplete } from './rhf-autocomplete';
import { RHFSelect, RHFMultiSelect } from './rhf-select';
import { RHFSwitch, RHFMultiSwitch } from './rhf-switch';
import { RHFCheckbox, RHFMultiCheckbox } from './rhf-checkbox';
import { RHFDatePicker, RHFTimePicker, RHFDateTimePicker } from './rhf-date-picker';

describe('Field map', () => {
  it('exposes all field components', () => {
    expect(Field.Select).toBe(RHFSelect);
    expect(Field.MultiSelect).toBe(RHFMultiSelect);
    expect(Field.Switch).toBe(RHFSwitch);
    expect(Field.MultiSwitch).toBe(RHFMultiSwitch);
    expect(Field.Slider).toBe(RHFSlider);
    expect(Field.Rating).toBe(RHFRating);
    expect(Field.Text).toBe(RHFTextField);
    expect(Field.Checkbox).toBe(RHFCheckbox);
    expect(Field.MultiCheckbox).toBe(RHFMultiCheckbox);
    expect(Field.RadioGroup).toBe(RHFRadioGroup);
    expect(Field.Autocomplete).toBe(RHFAutocomplete);
    expect(Field.DatePicker).toBe(RHFDatePicker);
    expect(Field.TimePicker).toBe(RHFTimePicker);
    expect(Field.DateTimePicker).toBe(RHFDateTimePicker);
  });
});
