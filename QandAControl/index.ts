import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { QandAControlReact, IQandAControlReactProps } from "./QandAControl";
import { IChoiceGroupOption } from "@fluentui/react/lib/ChoiceGroup";

export class QandAControl
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  /** Used to notify if the control has changed */
  private notifyOutputChanged: () => void;
  /** The current value of the control, what will be rendered and sent back to the data layer */
  private currentValue: string | null | undefined;
  /** The default value provided from the data layer */
  private defaultValue: string | undefined;
  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  // eslint-disable-next-line no-unused-vars
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    // eslint-disable-next-line no-unused-vars
    state: ComponentFramework.Dictionary,
    // eslint-disable-next-line no-unused-vars
    container: HTMLDivElement
  ): void {
    this.defaultValue == null ? "" : context.parameters.Default.raw;

    // Add control initialization code
    this.notifyOutputChanged = notifyOutputChanged;
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */

  /** Method that idenfities if provided string is parseable JSON */
  private tryParseJSONObject(jsonstring: string | null): boolean {
    if (jsonstring == null) return false;
    try {
      JSON.parse(jsonstring);
      return true;
    } catch (e) {
      return false;
    }
  }

  private onChoiceGroupChange = (e: any, selectedItem: IChoiceGroupOption) => {
    this.defaultValue = selectedItem.key.toString();
    this.onChange(selectedItem.key.toString());
  };

  /** Handles all ShapeShifter changes by updating the current and default value and letting the control know of the change */
  private onChange = (newValue?: string) => {
    this.currentValue = newValue;
    this.defaultValue = newValue;

    this.notifyOutputChanged();
  };

  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    this.currentValue = context.parameters.Default.raw;
    this.defaultValue =
      context.parameters.Default.raw == null
        ? undefined
        : context.parameters.Default.raw;

    let _optionsString: any =
      this.tryParseJSONObject(context.parameters.Options.raw) &&
      context.parameters.Options.raw != null
        ? context.parameters.Options.raw
        : `[]`;

    _optionsString = JSON.parse(_optionsString);

    const transformedJson = _optionsString.map(
      (item: { value: any; text: any }) => {
        return {
          key: item.value,
          text: item.text,
        };
      }
    );

    // optionStrings converted to JSON object for use in the control
    //   const _options = JSON.parse(_optionsString);
    const props: IQandAControlReactProps = {
      label: "",
      default: this.defaultValue,
      controlType: context.parameters.ControlType,
      onChoiceGroupChange: this.onChoiceGroupChange,
      onChange: this.onChange,
      choiceGroupOptions: transformedJson,
      checkboxGroupOptions: transformedJson,
    };
    // Add code to update control view
    return React.createElement(QandAControlReact, props);
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {
      Value:
        this.currentValue == null
          ? undefined
          : JSON.stringify(this.currentValue),
      Default:
        this.defaultValue == null
          ? undefined
          : JSON.stringify(this.defaultValue),
    };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
