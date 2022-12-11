import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
import {
  ChoiceGroup,
  IChoiceGroupOption,
} from "@fluentui/react/lib/ChoiceGroup";
import { DatePicker, defaultDatePickerStrings, IDatePicker } from "@fluentui/react/lib/DatePicker";
import { Label } from "@fluentui/react/lib/Label";
import { IStackProps, IStackStyles, IStackTokens, Stack } from "@fluentui/react/lib/Stack";
import { TextField } from "@fluentui/react/lib/TextField";
import React = require("react");
import { ICheckboxInput } from "./ICheckboxInput";

export interface IQandAControlReactProps {
  label?: string;
  default?: string | undefined;
  controlType: ComponentFramework.PropertyTypes.EnumProperty<
    | "String"
    | "Information"
    | "Date"
    | "SingleSelect"
    | "MultiSelect"
    | "Boolean"
  >;
  // eslint-disable-next-line no-unused-vars
  onChoiceGroupChange?: (e: any, selectedItem: any) => void;
  // eslint-disable-next-line no-unused-vars
  onChange: (selectedItem: any) => void;
  choiceGroupOptions: IChoiceGroupOption[];
  checkboxGroupOptions: ICheckboxInput[];
}
const stackTokens: IStackTokens = { childrenGap: 10 };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: 300 } },
};
const BooleanYes = [["Text", "Yes"], ["Value", "1"]];
const BooleanNo = [["Text", "No"], ["Value", "2"]];
const BooleanUnsure = [["Text", "Unsure"], ["Value", "3"]];
const Information = [["Value", "1"]];


export const QandAControlReact = React.memo(
  (props: IQandAControlReactProps) => {
    let el;


    // Define the JSON input object
    const input = {
      regex: '^[a-zA-Z0-9]*$',
      min: 5,
      max: 10
    };
  
    // Define the regex, min, and max validators
    const regexValidator = new RegExp(input.regex);
    const minValidator = (value: string) => value.length >= input.min;
    const maxValidator = (value: string) => value.length <= input.max;

    const [value, setValue] = React.useState('');
    const [Datevalue, setDateValue] = React.useState<Date | undefined>();
    const datePickerRef = React.useRef<IDatePicker>(null);

    const [selectedKey, setSelectedKey] = React.useState<IChoiceGroupOption>();
    const [selectedOptions, setSelectedOptions] = React.useState<
      ICheckboxInput[]
    >([]);

    const onCheckBoxGroupChange = (option: ICheckboxInput) => {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter((o) => o.key !== option.key));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }

    };

    function onChoiceGroupChange(
      ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
      option?: IChoiceGroupOption
    ): void {

      setSelectedKey(option);
     
    }

    function CheckButtonClicked(): void {
      if (selectedOptions) {
        const transformedJson = selectedOptions.map(
          (item: { key: any; text: any }) => {
            return {
              value: item.key,
              text: item.text,
            };
          }
        );
        alert(`Selected choice: ${JSON.stringify(transformedJson)}`);
        props.onChange(transformedJson);
        setSelectedOptions([]);

      }
    }

    function ChoiceButtonClicked(): void {
      if (selectedKey?.key) {
        const data = [[selectedKey.text, selectedKey.key]];
        const transformedJson = data.map(([text, value]) => ({ text, value }));
        alert(`Selected choice: ${JSON.stringify(transformedJson)}`);
        props.onChange(transformedJson);

      }
    }

    function onBooleanButtonClick(option: String[][]): void {
      alert(`Selected choice: ${JSON.stringify(option)}`);
      props.onChange(option);
    }
    const TextSubmit = () => {
        alert(`Selected Text: ${(value)}`);
        props.onChange([["Value", value]]);
      
    }
  
    const getErrorMessage = (value: string): string => {
      if (regexValidator.test(value) && minValidator(value) && maxValidator(value)) {
          
          return '';
      }
      else{
          return `ValidationError Message.`;
      }  
    };

    const getErrorMessagePromise = (value: string): Promise<string> => {
      setValue(value);
      return new Promise(resolve => {
        setTimeout(() => resolve(getErrorMessage(value)), 2000);
      });
    };
    const onFormatDate = (date?: Date): string => {
      return !date ? '' : (date.getFullYear()) + '/' + ((date.getMonth()+1).toString().padStart(2, '0')) + '/' + date.getDate().toString().padStart(2, '0');
    };
    function onDateClick(): void {
      if (Datevalue!=undefined)
      {
      const formattedDate = onFormatDate(Datevalue);
      
      alert(`Selected Date: ${(formattedDate)}`);
      props.onChange([["Text", formattedDate]]);
    }

    
    }

    switch (props.controlType.raw) {
      case "Date":
        el = (
          <Stack  tokens={stackTokens} styles={stackStyles}>
            <Stack {...columnProps}>
            <DatePicker
        componentRef={datePickerRef}
        label=""
        allowTextInput
        ariaLabel="Select a date"
        value={Datevalue}
        // eslint-disable-next-line no-unused-vars
        onSelectDate={setDateValue as (date: Date | null | undefined) => void}
        
        // DatePicker uses English strings by default. For localized apps, you must override this prop.
        strings={defaultDatePickerStrings}
      />
                 </Stack>
                 <Stack.Item align="auto">
              <span>
                <PrimaryButton text="Next"  onClick={()=>onDateClick()} />
                </span>
                </Stack.Item>
                
             </Stack>
        );
        break;
      case "String":
        el = (
          <Stack  tokens={stackTokens} styles={stackStyles}>
            <Stack {...columnProps}>
                 <TextField  onGetErrorMessage={getErrorMessagePromise} />
                 </Stack>
                 <Stack.Item align="auto">
              <span>
                <PrimaryButton text="Next"  onClick={() => TextSubmit()}  />
                </span>
                </Stack.Item>
                
             </Stack>
        );
        break;
      case "Information":
        el = (
          <Stack tokens={ { childrenGap: 30 }} horizontal>
 
                <PrimaryButton text="Next"  onClick={() => onBooleanButtonClick(Information)} />


             </Stack>
        );
        break;
      case "Boolean":
        el = (
          <Stack tokens={ { childrenGap: 30 }} horizontal>
 
                <PrimaryButton text="Yes"  onClick={() => onBooleanButtonClick(BooleanYes)} />
                <PrimaryButton text="No"  onClick={() => onBooleanButtonClick(BooleanNo)}/>
                <PrimaryButton text="Unsure" onClick={() => onBooleanButtonClick(BooleanUnsure)}/>

             </Stack>
        );
        break;
      case "SingleSelect":
        el = (
          <Stack tokens={stackTokens} verticalFill={true}>
            <ChoiceGroup
              label={props.label}
              options={props.choiceGroupOptions}
              defaultSelectedKey={props.default}
              onChange={onChoiceGroupChange}
            />
            <Stack.Item align="auto">
              <span>
                <PrimaryButton text="Next" onClick={ChoiceButtonClicked} />
              </span>
            </Stack.Item>
          </Stack>
        );
        break;
      case "MultiSelect":
        el = (
          <span>
            {props.checkboxGroupOptions.map((option: ICheckboxInput) => {
              return (
                <Stack tokens={stackTokens}>
                  <Checkbox
                    key={option.key}
                    label={option.text}
                    onChange={() => onCheckBoxGroupChange(option)}
                    checked={selectedOptions.includes(option)}
                  />
                  <span></span>
                </Stack>
              );
            })}{" "}
            <Stack.Item align="auto">
              <span>
                <PrimaryButton text="Next" onClick={CheckButtonClicked} />
              </span>
            </Stack.Item>
          </span>
        );
        break;
      default:
        el = <Label> {props.label}</Label>;
        break;
    }

    return el;
  }
);
