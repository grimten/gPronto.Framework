import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import { useEffect, useId, type Ref } from "react";
import {
  createGProntoFrameworkNotificationDeduplicationKey,
  notifyGProntoFramework,
} from "../../gPronto.Framework.ApplicationRoot.NotificationCreation";

type GComponentInputCommonProps = Readonly<{
  label: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  onBlur?: () => void;
}>;

type GComponentInputOption = Readonly<{
  value: string;
  label: string;
}>;

export type GComponentInputProps = GComponentInputCommonProps &
  (
    | Readonly<{
        kind: "text";
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "email";
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "password";
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "search";
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "telephone";
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "url";
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "color";
        value: string;
        onChange: (value: string) => void;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "date";
        value: string;
        onChange: (value: string) => void;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "date-time";
        value: string;
        onChange: (value: string) => void;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "time";
        value: string;
        onChange: (value: string) => void;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "number";
        value: number | null;
        onChange: (value: number | null) => void;
        min?: number;
        max?: number;
        step?: number | "any";
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "range";
        value: number;
        onChange: (value: number) => void;
        min: number;
        max: number;
        step?: number;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "file";
        onChange: (files: readonly File[]) => void;
        accept?: string;
        multiple?: boolean;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "select";
        value: string;
        onChange: (value: string) => void;
        options: readonly GComponentInputOption[];
        controlRef?: Ref<HTMLSelectElement>;
      }>
    | Readonly<{
        kind: "textarea";
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
        rows?: number;
        controlRef?: Ref<HTMLTextAreaElement>;
      }>
    | Readonly<{
        kind: "checkbox";
        checked: boolean;
        onChange: (checked: boolean) => void;
        controlRef?: Ref<HTMLInputElement>;
      }>
    | Readonly<{
        kind: "radio";
        value: string;
        onChange: (value: string) => void;
        options: readonly GComponentInputOption[];
      }>
  );

type GComponentInputIdentifiers = Readonly<{
  controlId: string;
  labelId: string;
  supportingTextId: string;
  optionId: (index: number) => string;
  optionLabelId: (index: number) => string;
}>;

type GComponentInputStringProps = Extract<
  GComponentInputProps,
  {
    kind:
      | "text"
      | "email"
      | "password"
      | "search"
      | "telephone"
      | "url"
      | "color"
      | "date"
      | "date-time"
      | "time";
  }
>;

const stringInputTypes = {
  text: "text",
  email: "email",
  password: "password",
  search: "search",
  telephone: "tel",
  url: "url",
  color: "color",
  date: "date",
  "date-time": "datetime-local",
  time: "time",
} as const;

const normalTypographyClass = "gcomponent-input__typography--normal";
const smallTypographyClass = "gcomponent-input__typography--small";

function getGComponentInputClassName(props: GComponentInputProps): string {
  return [
    "gcomponent-input",
    `gcomponent-input--${props.kind}`,
    ...(props.error === undefined ? [] : ["gcomponent-input--error"]),
    ...(props.disabled ? ["gcomponent-input--disabled"] : []),
  ].join(" ");
}

function getSupportingText(
  error: string | undefined,
  helperText: string | undefined,
): string | undefined {
  return error !== undefined ? error : helperText;
}

function renderSupportingText(
  props: GComponentInputCommonProps,
  identifiers: GComponentInputIdentifiers,
) {
  const supportingText = getSupportingText(props.error, props.helperText);

  return supportingText === undefined ? null : (
    <FormHelperText
      id={identifiers.supportingTextId}
      error={props.error !== undefined}
      className={`gcomponent-input__supporting-text ${smallTypographyClass}`}
    >
      {supportingText}
    </FormHelperText>
  );
}

function getSupportingTextIdentifier(
  props: GComponentInputCommonProps,
  identifiers: GComponentInputIdentifiers,
): string | undefined {
  return getSupportingText(props.error, props.helperText) === undefined
    ? undefined
    : identifiers.supportingTextId;
}

function renderStringInput(
  props: GComponentInputStringProps,
  identifiers: GComponentInputIdentifiers,
) {
  const placeholder = "placeholder" in props ? props.placeholder : undefined;
  const supportingTextId = getSupportingTextIdentifier(props, identifiers);

  return (
    <div
      className={getGComponentInputClassName(props)}
      data-input-kind={props.kind}
    >
      <TextField
        className="gcomponent-input__field-root"
        id={identifiers.controlId}
        type={stringInputTypes[props.kind]}
        label={props.label}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        name={props.name}
        placeholder={placeholder}
        required={props.required}
        disabled={props.disabled}
        error={props.error !== undefined}
        onBlur={props.onBlur}
        inputRef={props.controlRef}
        slotProps={{
          input: {
            className: "gcomponent-input__field",
            classes: { notchedOutline: "gcomponent-input__outline" },
          },
          htmlInput: {
            className: `gcomponent-input__control ${normalTypographyClass}`,
            "aria-invalid": props.error !== undefined,
            "aria-describedby": supportingTextId,
          },
          inputLabel: {
            className: `gcomponent-input__label ${smallTypographyClass}`,
            shrink: true,
          },
        }}
      />
      {renderSupportingText(props, identifiers)}
    </div>
  );
}

function renderNumberInput(
  props: Extract<GComponentInputProps, { kind: "number" }>,
  identifiers: GComponentInputIdentifiers,
) {
  const supportingTextId = getSupportingTextIdentifier(props, identifiers);

  return (
    <div
      className={getGComponentInputClassName(props)}
      data-input-kind="number"
    >
      <TextField
        className="gcomponent-input__field-root"
        id={identifiers.controlId}
        type="number"
        label={props.label}
        value={props.value ?? ""}
        onChange={(event) =>
          props.onChange(
            event.target.value === "" ? null : Number(event.target.value),
          )
        }
        name={props.name}
        required={props.required}
        disabled={props.disabled}
        error={props.error !== undefined}
        onBlur={props.onBlur}
        inputRef={props.controlRef}
        slotProps={{
          input: {
            className: "gcomponent-input__field",
            classes: { notchedOutline: "gcomponent-input__outline" },
          },
          htmlInput: {
            min: props.min,
            max: props.max,
            step: props.step,
            className: `gcomponent-input__control ${normalTypographyClass}`,
            "aria-invalid": props.error !== undefined,
            "aria-describedby": supportingTextId,
          },
          inputLabel: {
            className: `gcomponent-input__label ${smallTypographyClass}`,
            shrink: true,
          },
        }}
      />
      {renderSupportingText(props, identifiers)}
    </div>
  );
}

function renderRangeInput(
  props: Extract<GComponentInputProps, { kind: "range" }>,
  identifiers: GComponentInputIdentifiers,
) {
  const supportingTextId = getSupportingTextIdentifier(props, identifiers);

  return (
    <div className={getGComponentInputClassName(props)} data-input-kind="range">
      <TextField
        className="gcomponent-input__field-root"
        id={identifiers.controlId}
        type="range"
        label={props.label}
        value={props.value}
        onChange={(event) => props.onChange(Number(event.target.value))}
        name={props.name}
        required={props.required}
        disabled={props.disabled}
        error={props.error !== undefined}
        onBlur={props.onBlur}
        inputRef={props.controlRef}
        slotProps={{
          input: {
            className: "gcomponent-input__field",
            classes: { notchedOutline: "gcomponent-input__outline" },
          },
          htmlInput: {
            min: props.min,
            max: props.max,
            step: props.step,
            className: `gcomponent-input__control ${normalTypographyClass}`,
            "aria-invalid": props.error !== undefined,
            "aria-describedby": supportingTextId,
          },
          inputLabel: {
            className: `gcomponent-input__label ${smallTypographyClass}`,
            shrink: true,
          },
        }}
      />
      {renderSupportingText(props, identifiers)}
    </div>
  );
}

function renderFileInput(
  props: Extract<GComponentInputProps, { kind: "file" }>,
  identifiers: GComponentInputIdentifiers,
) {
  const supportingTextId = getSupportingTextIdentifier(props, identifiers);

  return (
    <div className={getGComponentInputClassName(props)} data-input-kind="file">
      <TextField
        className="gcomponent-input__field-root"
        id={identifiers.controlId}
        type="file"
        label={props.label}
        onChange={(event) => {
          const files = "files" in event.target ? event.target.files : null;
          props.onChange(Array.from(files ?? []));
        }}
        name={props.name}
        required={props.required}
        disabled={props.disabled}
        error={props.error !== undefined}
        onBlur={props.onBlur}
        inputRef={props.controlRef}
        slotProps={{
          input: {
            className: "gcomponent-input__field",
            classes: { notchedOutline: "gcomponent-input__outline" },
          },
          htmlInput: {
            accept: props.accept,
            multiple: props.multiple,
            className: `gcomponent-input__control ${normalTypographyClass}`,
            "aria-invalid": props.error !== undefined,
            "aria-describedby": supportingTextId,
          },
          inputLabel: {
            className: `gcomponent-input__label ${smallTypographyClass}`,
            shrink: true,
          },
        }}
      />
      {renderSupportingText(props, identifiers)}
    </div>
  );
}

function renderSelectInput(
  props: Extract<GComponentInputProps, { kind: "select" }>,
  identifiers: GComponentInputIdentifiers,
) {
  const supportingTextId = getSupportingTextIdentifier(props, identifiers);

  return (
    <FormControl
      required={props.required}
      disabled={props.disabled}
      error={props.error !== undefined}
      className={getGComponentInputClassName(props)}
      data-input-kind="select"
    >
      <InputLabel
        id={identifiers.labelId}
        htmlFor={identifiers.controlId}
        variant="standard"
        className={`gcomponent-input__label ${smallTypographyClass}`}
      >
        {props.label}
      </InputLabel>
      <NativeSelect
        className="gcomponent-input__field"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        name={props.name}
        required={props.required}
        disabled={props.disabled}
        onBlur={props.onBlur}
        inputRef={props.controlRef}
        inputProps={{
          id: identifiers.controlId,
          className: `gcomponent-input__control ${normalTypographyClass}`,
          "aria-labelledby": identifiers.labelId,
          "aria-invalid": props.error !== undefined,
          "aria-describedby": supportingTextId,
        }}
      >
        {props.options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className={normalTypographyClass}
          >
            {option.label}
          </option>
        ))}
      </NativeSelect>
      {renderSupportingText(props, identifiers)}
    </FormControl>
  );
}

function renderTextareaInput(
  props: Extract<GComponentInputProps, { kind: "textarea" }>,
  identifiers: GComponentInputIdentifiers,
) {
  const supportingTextId = getSupportingTextIdentifier(props, identifiers);

  return (
    <div
      className={getGComponentInputClassName(props)}
      data-input-kind="textarea"
    >
      <TextField
        className="gcomponent-input__field-root"
        id={identifiers.controlId}
        multiline
        rows={props.rows}
        label={props.label}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        name={props.name}
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.disabled}
        error={props.error !== undefined}
        onBlur={props.onBlur}
        inputRef={props.controlRef}
        slotProps={{
          input: {
            className: "gcomponent-input__field",
            classes: { notchedOutline: "gcomponent-input__outline" },
          },
          htmlInput: {
            className: `gcomponent-input__control ${normalTypographyClass}`,
            "aria-invalid": props.error !== undefined,
            "aria-describedby": supportingTextId,
          },
          inputLabel: {
            className: `gcomponent-input__label ${smallTypographyClass}`,
            shrink: true,
          },
        }}
      />
      {renderSupportingText(props, identifiers)}
    </div>
  );
}

function renderCheckboxInput(
  props: Extract<GComponentInputProps, { kind: "checkbox" }>,
  identifiers: GComponentInputIdentifiers,
) {
  const supportingTextId = getSupportingTextIdentifier(props, identifiers);

  return (
    <FormControl
      required={props.required}
      disabled={props.disabled}
      error={props.error !== undefined}
      className={getGComponentInputClassName(props)}
      data-input-kind="checkbox"
    >
      <FormControlLabel
        disabled={props.disabled}
        disableTypography
        label={
          <span
            id={identifiers.labelId}
            className={`gcomponent-input__label gcomponent-input__option-label ${smallTypographyClass}`}
          >
            {props.label}
          </span>
        }
        control={
          <Checkbox
            className="gcomponent-input__selection-control"
            id={identifiers.controlId}
            name={props.name}
            checked={props.checked}
            required={props.required}
            disabled={props.disabled}
            onChange={(event) => props.onChange(event.target.checked)}
            onBlur={props.onBlur}
            slotProps={{
              input: {
                ref: props.controlRef,
                className: "gcomponent-input__control",
                "aria-labelledby": identifiers.labelId,
                "aria-invalid": props.error !== undefined,
                "aria-describedby": supportingTextId,
              },
            }}
          />
        }
      />
      {renderSupportingText(props, identifiers)}
    </FormControl>
  );
}

function renderRadioInput(
  props: Extract<GComponentInputProps, { kind: "radio" }>,
  identifiers: GComponentInputIdentifiers,
) {
  const supportingTextId = getSupportingTextIdentifier(props, identifiers);

  return (
    <FormControl
      component="fieldset"
      required={props.required}
      disabled={props.disabled}
      error={props.error !== undefined}
      className={getGComponentInputClassName(props)}
      data-input-kind="radio"
    >
      <FormLabel
        component="legend"
        id={identifiers.labelId}
        className={`gcomponent-input__label ${smallTypographyClass}`}
      >
        {props.label}
      </FormLabel>
      <RadioGroup
        name={props.name}
        value={props.value}
        onChange={(_event, value) => props.onChange(value)}
        aria-labelledby={identifiers.labelId}
        aria-invalid={props.error !== undefined}
        aria-describedby={supportingTextId}
      >
        {props.options.map((option, index) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            disabled={props.disabled}
            disableTypography
            label={
              <span
                id={identifiers.optionLabelId(index)}
                className={`gcomponent-input__option-label ${smallTypographyClass}`}
              >
                {option.label}
              </span>
            }
            control={
              <Radio
                className="gcomponent-input__selection-control"
                id={identifiers.optionId(index)}
                name={props.name}
                required={props.required}
                disabled={props.disabled}
                onBlur={props.onBlur}
                slotProps={{
                  input: {
                    className: "gcomponent-input__control",
                    "aria-labelledby": identifiers.optionLabelId(index),
                    "aria-invalid": props.error !== undefined,
                    "aria-describedby": supportingTextId,
                  },
                }}
              />
            }
          />
        ))}
      </RadioGroup>
      {renderSupportingText(props, identifiers)}
    </FormControl>
  );
}

function assertNever(value: never): never {
  throw new TypeError(`Unsupported GComponentInput props: ${String(value)}`);
}

export function GComponentInput(props: GComponentInputProps) {
  const generatedId = useId();
  const inputName =
    props.name === undefined || props.name.trim().length === 0
      ? props.label
      : props.name;
  const errorMessage = props.error?.trim() ?? "";
  const helperTextMessage = props.helperText?.trim() ?? "";
  const identifiers: GComponentInputIdentifiers = {
    controlId: `gcomponent-input-${generatedId}-control`,
    labelId: `gcomponent-input-${generatedId}-label`,
    supportingTextId: `gcomponent-input-${generatedId}-supporting-text`,
    optionId: (index) => `gcomponent-input-${generatedId}-option-${index}`,
    optionLabelId: (index) =>
      `gcomponent-input-${generatedId}-option-${index}-label`,
  };

  useEffect(() => {
    if (errorMessage.length === 0) {
      return;
    }

    notifyGProntoFramework({
      type: "error",
      title: inputName,
      message: errorMessage,
      deduplicationKey: createGProntoFrameworkNotificationDeduplicationKey(
        "input-error",
        inputName,
        errorMessage,
      ),
    });
  }, [errorMessage, inputName]);

  useEffect(() => {
    if (helperTextMessage.length === 0) {
      return;
    }

    notifyGProntoFramework({
      type: "info",
      title: inputName,
      message: helperTextMessage,
      deduplicationKey: createGProntoFrameworkNotificationDeduplicationKey(
        "input-helper-text",
        inputName,
        helperTextMessage,
      ),
    });
  }, [helperTextMessage, inputName]);

  switch (props.kind) {
    case "text":
    case "email":
    case "password":
    case "search":
    case "telephone":
    case "url":
    case "color":
    case "date":
    case "date-time":
    case "time":
      return renderStringInput(props, identifiers);
    case "number":
      return renderNumberInput(props, identifiers);
    case "range":
      return renderRangeInput(props, identifiers);
    case "file":
      return renderFileInput(props, identifiers);
    case "select":
      return renderSelectInput(props, identifiers);
    case "textarea":
      if (
        props.rows !== undefined &&
        (!Number.isInteger(props.rows) || props.rows <= 0)
      ) {
        throw new TypeError(
          'GComponentInput rows must be a positive integer when kind is "textarea".',
        );
      }

      return renderTextareaInput(props, identifiers);
    case "checkbox":
      return renderCheckboxInput(props, identifiers);
    case "radio":
      return renderRadioInput(props, identifiers);
    default:
      return assertNever(props);
  }
}
