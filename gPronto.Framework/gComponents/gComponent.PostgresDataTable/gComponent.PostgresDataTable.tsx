import {
  DataGrid,
  getGridStringOperators,
  type GridColDef,
  type GridColumnVisibilityModel,
  type DataGridProps,
  type GridSortModel,
  type GridSortDirection,
} from "@mui/x-data-grid";
import { useDelete, useOne, useRefreshButton } from "@refinedev/core";
import { Create, Edit, useDataGrid } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import type { BaseSyntheticEvent, ReactElement } from "react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldValues,
} from "react-hook-form";
import {
  getGProntoFrameworkApplicationRootPublicPropertiesSnapshot,
  subscribeToGProntoFrameworkApplicationRootPublicProperties,
} from "../../gPronto.Framework.ApplicationRoot.PublicPropertiesStore";
import type { GProntoFrameworkPostgresDataTableSavedResourceSettings } from "../../gPronto.Framework.PostgresDataResources.PostgresDataTableSettingsContract";
import {
  readGProntoFrameworkPostgresDataTableSavedSettings,
  subscribeToGProntoFrameworkPostgresDataTableSavedSettings,
  writeGProntoFrameworkPostgresDataTableSavedSettings,
} from "../../gPronto.Framework.PostgresDataResources.PostgresDataTableSettingsRepository";
import {
  gProntoFrameworkPostgresDataResources,
  gProntoFrameworkSupabaseDataProviderName,
} from "../../gPronto.Framework.PostgresDataResources.Registry";
import { formatGProntoFrameworkValue } from "../../gPronto.Framework.DataResources.FormatCreation";
import type {
  GProntoFrameworkValidationDescriptor,
  GProntoFrameworkValidationResult,
} from "../../gPronto.Framework.DataResources.ValidationContract";
import {
  decodeGProntoFrameworkValue,
  encodeGProntoFrameworkValue,
} from "../../gPronto.Framework.DataResources.ValueCodec";
import type {
  GProntoFrameworkValueCodecDescriptor,
  GProntoFrameworkValueCodecResult,
} from "../../gPronto.Framework.DataResources.ValueCodecContract";
import { validateGProntoFrameworkValue } from "../../gPronto.Framework.DataResources.ValueValidation";
import { GComponentAlert } from "../gComponent.Alert/gComponent.Alert";
import { GComponentButton } from "../gComponent.Button/gComponent.Button";
import { GComponentFlow } from "../gComponent.Flow/gComponent.Flow";
import { GComponentInput } from "../gComponent.Input/gComponent.Input";
import { GComponentLoader } from "../gComponent.Loader/gComponent.Loader";
import { GComponentTypography } from "../gComponent.Typography/gComponent.Typography";

const gComponentPostgresDataTableNormalTypographyClass =
  "gcomponent-postgres-data-table__typography--normal";
const gComponentPostgresDataTableSmallTypographyClass =
  "gcomponent-postgres-data-table__typography--small";

type GComponentPostgresDataTableValidation = Readonly<{
  allow_null?: boolean;
  validate_enum?: readonly (string | number | boolean)[] | null;
  validate_regex?: string | null;
  validate_string_min_length?: number | null;
  validate_string_max_length?: number | null;
  validate_number_min?: number | null;
  validate_number_max?: number | null;
  validate_number_precision?: number | null;
  validate_number_scale?: number | null;
  validators?: readonly GProntoFrameworkValidationDescriptor[];
}>;

type GComponentPostgresDataTableWriteContext = Readonly<{
  label?: string;
  format?: string;
  allowed?: boolean;
  required?: boolean;
  default?: unknown;
  gcomponent?: string | null;
  short_description?: string | null;
}>;

type GComponentPostgresDataTablePostgresDataContractSchemaColumn = Readonly<{
  postgres_datatype?: string;
  validation?: GComponentPostgresDataTableValidation;
  insert?: GComponentPostgresDataTableWriteContext;
  update?: GComponentPostgresDataTableWriteContext;
  datatable?: Readonly<{
    label?: string;
    format?: string;
    can_be_visible_in_table?: boolean;
    default_visible_in_table?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    default_sort?: "asc" | "desc" | null;
  }>;
}>;

type GComponentPostgresDataTableResourceDefinition = Readonly<{
  identifier: string;
  meta: Readonly<{
    label: string;
    idColumnName: string;
    gPronto: Readonly<{
      postgresDataContractSchema: Readonly<{
        columns?: Readonly<
          Record<
            string,
            GComponentPostgresDataTablePostgresDataContractSchemaColumn
          >
        >;
      }>;
    }>;
  }>;
}>;

type GComponentPostgresDataTableColumnTyping = Readonly<{
  columnType?: "boolean" | "date" | "dateTime" | "number" | "string";
  filterable: boolean;
  sortable: boolean;
  uuidEqualityOnly: boolean;
  nullable: boolean;
}>;

type GComponentPostgresDataTableResolvedProperty = Readonly<{
  name: string;
  label: string;
  format: string;
  visible: boolean;
  typing: GComponentPostgresDataTableColumnTyping;
}>;

type GComponentPostgresDataTableWriteContextName = "insert" | "update";

type GComponentPostgresDataTableInputName =
  | "GComponentInputCheckbox"
  | "GComponentInputDate"
  | "GComponentInputDateTime"
  | "GComponentInputEmail"
  | "GComponentInputNumber"
  | "GComponentInputText"
  | "GComponentInputTextarea"
  | "GComponentInputUrl";

type GComponentPostgresDataTableInputKind =
  | "checkbox"
  | "date"
  | "date-time"
  | "email"
  | "number"
  | "text"
  | "textarea"
  | "url";

type GComponentPostgresDataTableResolvedWriteProperty = Readonly<{
  name: string;
  label: string;
  format: string;
  required: boolean;
  defaultValue: unknown;
  helperText: string | undefined;
  inputName: GComponentPostgresDataTableInputName;
  postgresDatatype: string | undefined;
  validation: GComponentPostgresDataTableValidation;
  validators: readonly GProntoFrameworkValidationDescriptor[];
  valueCodec: GProntoFrameworkValueCodecDescriptor;
}>;

type GComponentPostgresDataTableResolvedResource = Readonly<{
  identifier: string;
  label: string;
  idColumnName: string;
  actionColumnNames: Readonly<{
    view: string;
    edit: string;
    delete: string;
  }>;
  properties: readonly GComponentPostgresDataTableResolvedProperty[];
  sortablePropertyNames: ReadonlySet<string>;
  insertProperties: readonly GComponentPostgresDataTableResolvedWriteProperty[];
  updateProperties: readonly GComponentPostgresDataTableResolvedWriteProperty[];
  defaultSort: Readonly<{ field: string; order: "asc" | "desc" }> | null;
}>;

export type GComponentPostgresDataTableProps = Readonly<{
  resource: string;
  defaults?: Readonly<{
    visibleColumns?: readonly string[];
    sort?: Readonly<{
      field: string;
      order: "asc" | "desc";
    }> | null;
  }>;
}>;

type GComponentPostgresDataTableFrameState =
  | Readonly<{ frame: "table"; recordId: null }>
  | Readonly<{ frame: "edit"; recordId: string | number }>
  | Readonly<{ frame: "insert"; recordId: null }>
  | Readonly<{ frame: "view"; recordId: string | number }>
  | Readonly<{ frame: "delete"; recordId: string | number }>;

type GComponentPostgresDataTableOperationFrameState = Exclude<
  GComponentPostgresDataTableFrameState,
  Readonly<{ frame: "table"; recordId: null }>
>;

type GComponentPostgresDataTableWriteMode =
  | Readonly<{
      frame: "insert";
      context: "insert";
      action: "create";
      recordId: null;
    }>
  | Readonly<{
      frame: "edit";
      context: "update";
      action: "edit";
      recordId: string | number;
    }>;

const gComponentPostgresDataTableInitialFrameState: GComponentPostgresDataTableFrameState =
  {
    frame: "table",
    recordId: null,
  };

const gComponentPostgresDataTableFilterPanelSlotProps: NonNullable<
  NonNullable<DataGridProps["slotProps"]>["filterPanel"]
> &
  Readonly<{ className: string }> = {
  className: `${gComponentPostgresDataTableSmallTypographyClass} gcomponent-postgres-data-table__filter-panel`,
};

function createGComponentPostgresDataTableActionColumnNames(
  schemaColumnNames: readonly string[],
): GComponentPostgresDataTableResolvedResource["actionColumnNames"] {
  const allocatedNames = new Set(schemaColumnNames);
  const allocateName = (baseName: string): string => {
    let candidate = baseName;
    let suffix = 1;

    while (allocatedNames.has(candidate)) {
      candidate = `${baseName}_${suffix}`;
      suffix += 1;
    }

    allocatedNames.add(candidate);
    return candidate;
  };

  return Object.freeze({
    view: allocateName("__gpronto_view"),
    edit: allocateName("__gpronto_edit"),
    delete: allocateName("__gpronto_delete"),
  });
}

function resolveGComponentPostgresDataTableColumnType(
  postgresDatatype: string | undefined,
): GComponentPostgresDataTableColumnTyping["columnType"] {
  if (postgresDatatype === undefined || postgresDatatype.endsWith("[]")) {
    return undefined;
  }

  if (postgresDatatype === "boolean") {
    return "boolean";
  }

  if (
    postgresDatatype === "integer" ||
    postgresDatatype.startsWith("numeric")
  ) {
    return "number";
  }

  if (postgresDatatype === "timestamp with time zone") {
    return "dateTime";
  }

  if (postgresDatatype === "date") {
    return "date";
  }

  if (postgresDatatype === "jsonb") {
    return undefined;
  }

  return "string";
}

function resolveGComponentPostgresDataTableColumnTyping(
  column: GComponentPostgresDataTablePostgresDataContractSchemaColumn,
): GComponentPostgresDataTableColumnTyping {
  return {
    columnType: resolveGComponentPostgresDataTableColumnType(
      column.postgres_datatype,
    ),
    filterable: column.datatable?.filterable === true,
    sortable: column.datatable?.sortable === true,
    uuidEqualityOnly: column.postgres_datatype === "uuid",
    nullable: column.validation?.allow_null === true,
  };
}

function describeGComponentPostgresDataTableConfiguredInput(
  configuredInput: string | null | undefined,
): string {
  return configuredInput === undefined
    ? "undefined"
    : JSON.stringify(configuredInput);
}

function resolveGComponentPostgresDataTableInputName(
  resourceIdentifier: string,
  context: GComponentPostgresDataTableWriteContextName,
  columnName: string,
  configuredInput: string | null | undefined,
): GComponentPostgresDataTableInputName {
  switch (configuredInput) {
    case "GComponentInputCheckbox":
    case "GComponentInputDate":
    case "GComponentInputDateTime":
    case "GComponentInputEmail":
    case "GComponentInputNumber":
    case "GComponentInputText":
    case "GComponentInputTextarea":
    case "GComponentInputUrl":
      return configuredInput;
    default:
      throw new Error(
        `The resource "${resourceIdentifier}" ${context} column "${columnName}" configures unsupported input gComponent ${describeGComponentPostgresDataTableConfiguredInput(configuredInput)}.`,
      );
  }
}

function resolveGComponentPostgresDataTableInputKind(
  inputName: GComponentPostgresDataTableInputName,
): GComponentPostgresDataTableInputKind {
  switch (inputName) {
    case "GComponentInputCheckbox":
      return "checkbox";
    case "GComponentInputDate":
      return "date";
    case "GComponentInputDateTime":
      return "date-time";
    case "GComponentInputEmail":
      return "email";
    case "GComponentInputNumber":
      return "number";
    case "GComponentInputText":
      return "text";
    case "GComponentInputTextarea":
      return "textarea";
    case "GComponentInputUrl":
      return "url";
  }
}

function resolveGComponentPostgresDataTableValueCodec(
  resourceIdentifier: string,
  columnName: string,
  postgresDatatype: string | undefined,
  inputKind: GComponentPostgresDataTableInputKind,
  allowNull: boolean,
): GProntoFrameworkValueCodecDescriptor {
  const options = { allowNull };

  if (postgresDatatype === "boolean" && inputKind === "checkbox") {
    return { codec: "boolean.standard", options };
  }

  if (
    (postgresDatatype === "integer" ||
      (postgresDatatype !== undefined &&
        /^numeric\([^()]+\)$/.test(postgresDatatype))) &&
    inputKind === "number"
  ) {
    return { codec: "number.standard", options };
  }

  if (
    postgresDatatype === "timestamp with time zone" &&
    inputKind === "date-time"
  ) {
    return { codec: "timestamp.local", options };
  }

  if (postgresDatatype === "jsonb" && inputKind === "textarea") {
    return { codec: "jsonb.standard", options };
  }

  if (
    postgresDatatype === "text[]" &&
    (inputKind === "text" || inputKind === "textarea")
  ) {
    return { codec: "text.array.comma", options };
  }

  if (
    (postgresDatatype === "date" && inputKind === "date") ||
    (postgresDatatype === "uuid" && inputKind === "text") ||
    ((postgresDatatype === "text" ||
      postgresDatatype === "extensions.citext") &&
      (inputKind === "text" ||
        inputKind === "email" ||
        inputKind === "url" ||
        inputKind === "textarea"))
  ) {
    return { codec: "string.standard", options };
  }

  throw new Error(
    `No value codec is registered for resource "${resourceIdentifier}" column "${columnName}" with datatype "${postgresDatatype}" and input kind "${inputKind}".`,
  );
}

function resolveGComponentPostgresDataTableSemanticValidator(
  inputName: GComponentPostgresDataTableInputName,
  postgresDatatype: string | undefined,
): GProntoFrameworkValidationDescriptor | undefined {
  if (postgresDatatype === "uuid") {
    return { validator: "uuid.standard", options: null };
  }

  if (postgresDatatype === "jsonb") {
    return { validator: "json.standard", options: null };
  }

  switch (inputName) {
    case "GComponentInputEmail":
      return { validator: "email.standard", options: null };
    case "GComponentInputUrl":
      return { validator: "url.standard", options: null };
    case "GComponentInputDate":
      return { validator: "date.standard", options: null };
    case "GComponentInputDateTime":
      return { validator: "datetime.standard", options: null };
    case "GComponentInputNumber":
      return postgresDatatype === "integer"
        ? { validator: "number.integer", options: null }
        : undefined;
    default:
      return undefined;
  }
}

function deriveGComponentPostgresDataTableValidators(
  resourceIdentifier: string,
  columnName: string,
  writeContext: GComponentPostgresDataTableWriteContext,
  validation: GComponentPostgresDataTableValidation,
  inputName: GComponentPostgresDataTableInputName,
  postgresDatatype: string | undefined,
): readonly GProntoFrameworkValidationDescriptor[] {
  const descriptors: GProntoFrameworkValidationDescriptor[] = [];

  if (validation.allow_null === false || writeContext.required === true) {
    descriptors.push({ validator: "value.required", options: null });
  }

  if (
    validation.validate_enum !== null &&
    validation.validate_enum !== undefined
  ) {
    descriptors.push({
      validator: "enum.allowed",
      options: { values: validation.validate_enum },
    });
  }

  if (
    validation.validate_regex !== null &&
    validation.validate_regex !== undefined
  ) {
    descriptors.push({
      validator: "string.pattern",
      options: { pattern: validation.validate_regex },
    });
  }

  if (
    validation.validate_string_min_length !== null &&
    validation.validate_string_min_length !== undefined
  ) {
    descriptors.push({
      validator: "string.minimum_length",
      options: { length: validation.validate_string_min_length },
    });
  }

  if (
    validation.validate_string_max_length !== null &&
    validation.validate_string_max_length !== undefined
  ) {
    descriptors.push({
      validator: "string.maximum_length",
      options: { length: validation.validate_string_max_length },
    });
  }

  if (
    validation.validate_number_min !== null &&
    validation.validate_number_min !== undefined
  ) {
    descriptors.push({
      validator: "number.minimum",
      options: { value: validation.validate_number_min },
    });
  }

  if (
    validation.validate_number_max !== null &&
    validation.validate_number_max !== undefined
  ) {
    descriptors.push({
      validator: "number.maximum",
      options: { value: validation.validate_number_max },
    });
  }

  if (postgresDatatype === "integer") {
    descriptors.push({ validator: "number.integer", options: null });
  }

  if (
    validation.validate_number_precision !== null &&
    validation.validate_number_precision !== undefined &&
    validation.validate_number_scale !== null &&
    validation.validate_number_scale !== undefined
  ) {
    descriptors.push({
      validator: "number.precision_scale",
      options: {
        precision: validation.validate_number_precision,
        scale: validation.validate_number_scale,
      },
    });
  }

  const semanticDescriptor =
    resolveGComponentPostgresDataTableSemanticValidator(
      inputName,
      postgresDatatype,
    );

  if (semanticDescriptor !== undefined) {
    descriptors.push(semanticDescriptor);
  }

  descriptors.push(...(validation.validators ?? []));

  try {
    validateGProntoFrameworkValue(undefined, descriptors);
  } catch (error) {
    if (error instanceof TypeError) {
      const indexMatch =
        /^Invalid validator descriptor at index ([0-9]+)\.$/.exec(
          error.message,
        );

      if (indexMatch !== null) {
        throw new TypeError(
          `The resource "${resourceIdentifier}" column "${columnName}" has an invalid validator descriptor at index ${indexMatch[1]}.`,
        );
      }
    }

    throw error;
  }

  const seenValidators = new Set<string>();

  return descriptors.filter((descriptor) => {
    if (seenValidators.has(descriptor.validator)) {
      return false;
    }

    seenValidators.add(descriptor.validator);
    return true;
  });
}

function deriveGComponentPostgresDataTableWriteProperties(
  resourceIdentifier: string,
  context: GComponentPostgresDataTableWriteContextName,
  schemaColumns: Readonly<
    Record<string, GComponentPostgresDataTablePostgresDataContractSchemaColumn>
  >,
): readonly GComponentPostgresDataTableResolvedWriteProperty[] {
  return Object.entries(schemaColumns)
    .filter(([, column]) => column[context]?.allowed === true)
    .map(([columnName, column]) => {
      const writeContext = column[context];

      if (writeContext === undefined) {
        throw new Error(
          `The resource "${resourceIdentifier}" ${context} column "${columnName}" has no write context.`,
        );
      }

      const inputName = resolveGComponentPostgresDataTableInputName(
        resourceIdentifier,
        context,
        columnName,
        writeContext.gcomponent,
      );
      const validation = column.validation ?? {};
      const inputKind = resolveGComponentPostgresDataTableInputKind(inputName);

      return {
        name: columnName,
        label: writeContext.label ?? columnName,
        format: writeContext.format ?? "",
        required: writeContext.required === true,
        defaultValue: writeContext.default,
        helperText:
          typeof writeContext.short_description === "string"
            ? writeContext.short_description
            : undefined,
        inputName,
        postgresDatatype: column.postgres_datatype,
        validation,
        validators: deriveGComponentPostgresDataTableValidators(
          resourceIdentifier,
          columnName,
          writeContext,
          validation,
          inputName,
          column.postgres_datatype,
        ),
        valueCodec: resolveGComponentPostgresDataTableValueCodec(
          resourceIdentifier,
          columnName,
          column.postgres_datatype,
          inputKind,
          validation.allow_null === true,
        ),
      };
    });
}

function resolveGComponentPostgresDataTableResource(
  resource: string,
  defaults: GComponentPostgresDataTableProps["defaults"],
): GComponentPostgresDataTableResolvedResource {
  const definitions: readonly GComponentPostgresDataTableResourceDefinition[] =
    gProntoFrameworkPostgresDataResources;
  const definition = definitions.find(
    (candidate) => candidate.identifier === resource,
  );

  if (definition === undefined) {
    throw new Error(
      `No gPronto.Framework data resource is registered for the resource identifier "${resource}".`,
    );
  }

  const schemaColumns =
    definition.meta.gPronto.postgresDataContractSchema.columns ?? {};
  const actionColumnNames = createGComponentPostgresDataTableActionColumnNames(
    Object.keys(schemaColumns),
  );
  const sortedColumn = Object.entries(schemaColumns).find(
    ([, column]) =>
      column.datatable?.default_sort === "asc" ||
      column.datatable?.default_sort === "desc",
  );
  const permittedProperties = Object.entries(schemaColumns).filter(
    ([, column]) => column.datatable?.can_be_visible_in_table !== false,
  );
  const permittedPropertyNames = new Set(
    permittedProperties.map(([columnName]) => columnName),
  );
  const sortablePropertyNames = new Set(
    Object.entries(schemaColumns)
      .filter(([, column]) => column.datatable?.sortable === true)
      .map(([columnName]) => columnName),
  );
  const configuredVisibleColumns = defaults?.visibleColumns;
  let visiblePropertyNames: ReadonlySet<string> | undefined;

  if (configuredVisibleColumns !== undefined) {
    const seenVisibleColumns = new Set<string>();

    for (const columnName of configuredVisibleColumns) {
      if (!permittedPropertyNames.has(columnName)) {
        throw new Error(
          `The data-table default visible column "${columnName}" is not available for resource "${resource}".`,
        );
      }

      if (seenVisibleColumns.has(columnName)) {
        throw new Error(
          `The data-table default visible column "${columnName}" is listed more than once for resource "${resource}".`,
        );
      }

      seenVisibleColumns.add(columnName);
    }

    visiblePropertyNames = seenVisibleColumns;
  }

  const configuredSort = defaults?.sort;
  let defaultSort: GComponentPostgresDataTableResolvedResource["defaultSort"];

  if (configuredSort === null) {
    defaultSort = null;
  } else if (configuredSort !== undefined) {
    if (!sortablePropertyNames.has(configuredSort.field)) {
      throw new Error(
        `The data-table default sort column "${configuredSort.field}" is not sortable for resource "${resource}".`,
      );
    }

    defaultSort = configuredSort;
  } else {
    defaultSort =
      sortedColumn === undefined
        ? { field: definition.meta.idColumnName, order: "asc" }
        : {
            field: sortedColumn[0],
            order: sortedColumn[1].datatable?.default_sort as "asc" | "desc",
          };
  }

  return {
    identifier: definition.identifier,
    label: definition.meta.label,
    idColumnName: definition.meta.idColumnName,
    actionColumnNames,
    properties: permittedProperties.map(([columnName, column]) => ({
      name: columnName,
      label: column.datatable?.label ?? columnName,
      format: column.datatable?.format ?? "",
      visible:
        visiblePropertyNames === undefined
          ? column.datatable?.default_visible_in_table === true
          : visiblePropertyNames.has(columnName),
      typing: resolveGComponentPostgresDataTableColumnTyping(column),
    })),
    sortablePropertyNames,
    insertProperties: deriveGComponentPostgresDataTableWriteProperties(
      definition.identifier,
      "insert",
      schemaColumns,
    ),
    updateProperties: deriveGComponentPostgresDataTableWriteProperties(
      definition.identifier,
      "update",
      schemaColumns,
    ),
    defaultSort,
  };
}

function createGComponentPostgresDataTableSettings(
  visibleColumns: readonly string[],
  sort: GProntoFrameworkPostgresDataTableSavedResourceSettings["sort"],
): GProntoFrameworkPostgresDataTableSavedResourceSettings {
  return Object.freeze({
    visibleColumns: Object.freeze([...visibleColumns]),
    sort:
      sort === null
        ? null
        : Object.freeze({ field: sort.field, order: sort.order }),
  });
}

function getGComponentPostgresDataTableFallbackSettings(
  resolvedResource: GComponentPostgresDataTableResolvedResource,
): GProntoFrameworkPostgresDataTableSavedResourceSettings {
  return createGComponentPostgresDataTableSettings(
    resolvedResource.properties
      .filter((property) => property.visible)
      .map((property) => property.name),
    resolvedResource.defaultSort,
  );
}

function resolveGComponentPostgresDataTableSavedSettings(
  savedSettings: GProntoFrameworkPostgresDataTableSavedResourceSettings | null,
  resolvedResource: GComponentPostgresDataTableResolvedResource,
): GProntoFrameworkPostgresDataTableSavedResourceSettings | null {
  if (savedSettings === null) {
    return null;
  }

  const permittedPropertyNames = new Set(
    resolvedResource.properties.map((property) => property.name),
  );
  const savedVisiblePropertyNames = new Set<string>();

  for (const propertyName of savedSettings.visibleColumns) {
    if (
      !permittedPropertyNames.has(propertyName) ||
      savedVisiblePropertyNames.has(propertyName)
    ) {
      return null;
    }

    savedVisiblePropertyNames.add(propertyName);
  }

  if (savedSettings.sort !== null) {
    if (!resolvedResource.sortablePropertyNames.has(savedSettings.sort.field)) {
      return null;
    }
  }

  return createGComponentPostgresDataTableSettings(
    resolvedResource.properties
      .filter((property) => savedVisiblePropertyNames.has(property.name))
      .map((property) => property.name),
    savedSettings.sort,
  );
}

function readGComponentPostgresDataTableSettings(
  authUserId: string,
  resolvedResource: GComponentPostgresDataTableResolvedResource,
): GProntoFrameworkPostgresDataTableSavedResourceSettings {
  const savedSettings = readGProntoFrameworkPostgresDataTableSavedSettings(
    authUserId,
    resolvedResource.identifier,
  );

  return (
    resolveGComponentPostgresDataTableSavedSettings(
      savedSettings,
      resolvedResource,
    ) ?? getGComponentPostgresDataTableFallbackSettings(resolvedResource)
  );
}

function areGComponentPostgresDataTableSortsEqual(
  first: GProntoFrameworkPostgresDataTableSavedResourceSettings["sort"],
  second: GProntoFrameworkPostgresDataTableSavedResourceSettings["sort"],
): boolean {
  return (
    (first === null && second === null) ||
    (first !== null &&
      second !== null &&
      first.field === second.field &&
      first.order === second.order)
  );
}

function areGComponentPostgresDataTableSettingsEqual(
  first: GProntoFrameworkPostgresDataTableSavedResourceSettings,
  second: GProntoFrameworkPostgresDataTableSavedResourceSettings,
): boolean {
  return (
    areGComponentPostgresDataTableSortsEqual(first.sort, second.sort) &&
    first.visibleColumns.length === second.visibleColumns.length &&
    first.visibleColumns.every(
      (propertyName, index) => propertyName === second.visibleColumns[index],
    )
  );
}

function createGComponentPostgresDataTableColumnVisibilityModel(
  settings: GProntoFrameworkPostgresDataTableSavedResourceSettings,
  resolvedResource: GComponentPostgresDataTableResolvedResource,
): GridColumnVisibilityModel {
  const visiblePropertyNames = new Set(settings.visibleColumns);
  const model: GridColumnVisibilityModel = {};

  for (const property of resolvedResource.properties) {
    model[property.name] = visiblePropertyNames.has(property.name);
  }

  return model;
}

function createGComponentPostgresDataTableGridSortModel(
  sort: GProntoFrameworkPostgresDataTableSavedResourceSettings["sort"],
): GridSortModel {
  return sort === null ? [] : [{ field: sort.field, sort: sort.order }];
}

function resolveGComponentPostgresDataTableSavedSort(
  sortModel: GridSortModel,
  resolvedResource: GComponentPostgresDataTableResolvedResource,
): GProntoFrameworkPostgresDataTableSavedResourceSettings["sort"] | undefined {
  if (sortModel.length === 0) {
    return null;
  }

  if (sortModel.length !== 1) {
    return undefined;
  }

  const [sortItem] = sortModel;

  if (sortItem.sort === null || sortItem.sort === undefined) {
    return null;
  }

  if (
    !resolvedResource.sortablePropertyNames.has(sortItem.field) ||
    (sortItem.sort !== "asc" && sortItem.sort !== "desc")
  ) {
    return undefined;
  }

  return Object.freeze({ field: sortItem.field, order: sortItem.sort });
}

function getGComponentPostgresDataTableDateCellValue(
  cellValue: unknown,
): Date | null {
  if (cellValue === null || cellValue === undefined) {
    return null;
  }

  return new Date(cellValue as string);
}

const gComponentPostgresDataTableUuidFilterOperatorValues: readonly string[] = [
  "equals",
  "doesNotEqual",
];

const gComponentPostgresDataTableNullableUuidFilterOperatorValues: readonly string[] =
  [
    ...gComponentPostgresDataTableUuidFilterOperatorValues,
    "isEmpty",
    "isNotEmpty",
  ];

const gComponentPostgresDataTableSortingOrder: GridSortDirection[] = [
  "asc",
  "desc",
];

function resolveGComponentPostgresDataTableUuidFilterOperators(
  nullable: boolean,
): ReturnType<typeof getGridStringOperators> {
  const allowedOperatorValues = nullable
    ? gComponentPostgresDataTableNullableUuidFilterOperatorValues
    : gComponentPostgresDataTableUuidFilterOperatorValues;

  return getGridStringOperators().filter((stringOperator) =>
    allowedOperatorValues.includes(stringOperator.value),
  );
}

function createGComponentPostgresDataTableColumnDefinition(
  property: GComponentPostgresDataTableResolvedProperty,
): GridColDef {
  const { typing } = property;
  const isDateColumn =
    typing.columnType === "date" || typing.columnType === "dateTime";

  return {
    field: property.name,
    headerName: property.label,
    headerClassName: `${gComponentPostgresDataTableSmallTypographyClass} gcomponent-postgres-data-table__column-header`,
    ...(typing.columnType === undefined ? {} : { type: typing.columnType }),
    ...(typing.filterable ? {} : { filterable: false }),
    ...(typing.sortable ? {} : { sortable: false }),
    ...(isDateColumn
      ? { valueGetter: getGComponentPostgresDataTableDateCellValue }
      : {}),
    ...(typing.uuidEqualityOnly
      ? {
          filterOperators:
            resolveGComponentPostgresDataTableUuidFilterOperators(
              typing.nullable,
            ),
        }
      : {}),
    renderCell: (params) => {
      const formattedValue = formatGProntoFrameworkValue(
        params.row[property.name],
        property.format,
      );

      return formattedValue === null || formattedValue === undefined ? null : (
        <span
          className={`${gComponentPostgresDataTableNormalTypographyClass} gcomponent-postgres-data-table__cell-content`}
        >
          {formattedValue}
        </span>
      );
    },
  };
}

function createGComponentPostgresDataTableActionColumnDefinition(
  field: string,
  header: "View" | "Edit" | "Delete",
  frame: "view" | "edit" | "delete",
  idColumnName: string,
  onFrameChange: (frameState: GComponentPostgresDataTableFrameState) => void,
): GridColDef {
  return {
    field,
    headerName: header,
    headerClassName: `${gComponentPostgresDataTableSmallTypographyClass} gcomponent-postgres-data-table__column-header`,
    width: 64,
    sortable: false,
    filterable: false,
    hideable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const recordId = params.row[idColumnName] as string | number;

      return (
        <div className="gcomponent-postgres-data-table__action-cell">
          <GComponentButton
            variant={header === "Delete" ? "danger" : "secondary"}
            text={header}
            onClick={() => onFrameChange({ frame, recordId })}
            icon={
              header === "View"
                ? "ViewDetails"
                : header === "Edit"
                  ? "Edit"
                  : "Delete"
            }
            iconOnly
          />
        </div>
      );
    },
  };
}

type GComponentPostgresDataTableTableFrameProps = Readonly<{
  authUserId: string;
  resource: string;
  resolvedResource: GComponentPostgresDataTableResolvedResource;
  onFrameChange: (frameState: GComponentPostgresDataTableFrameState) => void;
}>;

function GComponentPostgresDataTableTableFrame({
  authUserId,
  resource,
  resolvedResource,
  onFrameChange,
}: GComponentPostgresDataTableTableFrameProps) {
  const [settings, setSettings] = useState(() =>
    readGComponentPostgresDataTableSettings(authUserId, resolvedResource),
  );
  const settingsRef = useRef(settings);
  const initialSettingsRef = useRef(settings);
  const { dataGridProps, setSorters } = useDataGrid({
    resource,
    pagination: { pageSize: 25, mode: "server" },
    sorters: {
      initial:
        initialSettingsRef.current.sort === null
          ? []
          : [initialSettingsRef.current.sort],
    },
  });

  useEffect(
    () =>
      subscribeToGProntoFrameworkPostgresDataTableSavedSettings(
        authUserId,
        resolvedResource.identifier,
        (savedSettings) => {
          const nextSettings =
            resolveGComponentPostgresDataTableSavedSettings(
              savedSettings,
              resolvedResource,
            ) ??
            getGComponentPostgresDataTableFallbackSettings(resolvedResource);
          const currentSettings = settingsRef.current;

          if (
            areGComponentPostgresDataTableSettingsEqual(
              currentSettings,
              nextSettings,
            )
          ) {
            return;
          }

          settingsRef.current = nextSettings;
          setSettings(nextSettings);

          if (
            !areGComponentPostgresDataTableSortsEqual(
              currentSettings.sort,
              nextSettings.sort,
            )
          ) {
            setSorters(
              nextSettings.sort === null
                ? []
                : [
                    {
                      field: nextSettings.sort.field,
                      order: nextSettings.sort.order,
                    },
                  ],
            );
          }
        },
      ),
    [authUserId, resolvedResource, setSorters],
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      ...resolvedResource.properties.map((property) =>
        createGComponentPostgresDataTableColumnDefinition(property),
      ),
      createGComponentPostgresDataTableActionColumnDefinition(
        resolvedResource.actionColumnNames.view,
        "View",
        "view",
        resolvedResource.idColumnName,
        onFrameChange,
      ),
      createGComponentPostgresDataTableActionColumnDefinition(
        resolvedResource.actionColumnNames.edit,
        "Edit",
        "edit",
        resolvedResource.idColumnName,
        onFrameChange,
      ),
      createGComponentPostgresDataTableActionColumnDefinition(
        resolvedResource.actionColumnNames.delete,
        "Delete",
        "delete",
        resolvedResource.idColumnName,
        onFrameChange,
      ),
    ],
    [onFrameChange, resolvedResource],
  );

  const columnVisibilityModel = useMemo(
    () =>
      createGComponentPostgresDataTableColumnVisibilityModel(
        settings,
        resolvedResource,
      ),
    [resolvedResource, settings],
  );
  const sortModel = useMemo(
    () => createGComponentPostgresDataTableGridSortModel(settings.sort),
    [settings.sort],
  );
  const handleColumnVisibilityModelChange = (
    nextModel: GridColumnVisibilityModel,
  ) => {
    const nextSettings = createGComponentPostgresDataTableSettings(
      resolvedResource.properties
        .filter((property) => nextModel[property.name] !== false)
        .map((property) => property.name),
      settingsRef.current.sort,
    );

    if (
      areGComponentPostgresDataTableSettingsEqual(
        settingsRef.current,
        nextSettings,
      )
    ) {
      return;
    }

    settingsRef.current = nextSettings;
    setSettings(nextSettings);
    writeGProntoFrameworkPostgresDataTableSavedSettings(
      authUserId,
      resolvedResource.identifier,
      nextSettings,
    );
  };
  const handleSortModelChange: typeof dataGridProps.onSortModelChange = (
    nextModel,
    details,
  ) => {
    const nextSort = resolveGComponentPostgresDataTableSavedSort(
      nextModel,
      resolvedResource,
    );

    if (nextSort === undefined) {
      return;
    }

    const nextSettings = createGComponentPostgresDataTableSettings(
      settingsRef.current.visibleColumns,
      nextSort,
    );

    if (
      areGComponentPostgresDataTableSettingsEqual(
        settingsRef.current,
        nextSettings,
      )
    ) {
      return;
    }

    const normalizedSortModel = createGComponentPostgresDataTableGridSortModel(
      nextSettings.sort,
    );
    settingsRef.current = nextSettings;
    setSettings(nextSettings);
    dataGridProps.onSortModelChange(normalizedSortModel, details);
    writeGProntoFrameworkPostgresDataTableSavedSettings(
      authUserId,
      resolvedResource.identifier,
      nextSettings,
    );
  };

  return (
    <>
      <GComponentButton
        variant="primary"
        text="Insert"
        onClick={() => onFrameChange({ frame: "insert", recordId: null })}
        icon="Create"
      />
      <DataGrid
        {...dataGridProps}
        className="gcomponent-postgres-data-table__grid"
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
        getRowId={(row) => row[resolvedResource.idColumnName]}
        getRowClassName={() => "gcomponent-postgres-data-table__row"}
        getCellClassName={() => "gcomponent-postgres-data-table__cell"}
        rowSelection={false}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        sortingOrder={gComponentPostgresDataTableSortingOrder}
        slotProps={{
          baseAutocomplete: {
            slotProps: {
              textField: {
                className: `${gComponentPostgresDataTableSmallTypographyClass} gcomponent-postgres-data-table__field`,
                slotProps: {
                  input: {
                    className: gComponentPostgresDataTableNormalTypographyClass,
                  },
                  inputLabel: {
                    className: gComponentPostgresDataTableSmallTypographyClass,
                  },
                  htmlInput: {
                    className: `${gComponentPostgresDataTableNormalTypographyClass} gcomponent-postgres-data-table__field-control`,
                  },
                },
              },
            },
          },
          baseButton: {
            className: `${gComponentPostgresDataTableNormalTypographyClass} gcomponent-postgres-data-table__button`,
          },
          baseInput: {
            className: `${gComponentPostgresDataTableNormalTypographyClass} gcomponent-postgres-data-table__field`,
          },
          baseMenuItem: {
            className: `${gComponentPostgresDataTableSmallTypographyClass} gcomponent-postgres-data-table__menu-item`,
          },
          basePagination: {
            className: `${gComponentPostgresDataTableSmallTypographyClass} gcomponent-postgres-data-table__pagination`,
          },
          baseSelect: {
            className: `${gComponentPostgresDataTableNormalTypographyClass} gcomponent-postgres-data-table__field`,
          },
          baseSelectOption: {
            className: `${gComponentPostgresDataTableNormalTypographyClass} gcomponent-postgres-data-table__select-option`,
          },
          baseTextarea: {
            className: `${gComponentPostgresDataTableNormalTypographyClass} gcomponent-postgres-data-table__field`,
          },
          baseTextField: {
            className: `${gComponentPostgresDataTableSmallTypographyClass} gcomponent-postgres-data-table__field`,
            slotProps: {
              input: {
                className: gComponentPostgresDataTableNormalTypographyClass,
              },
              inputLabel: {
                className: gComponentPostgresDataTableSmallTypographyClass,
              },
              htmlInput: {
                className: `${gComponentPostgresDataTableNormalTypographyClass} gcomponent-postgres-data-table__field-control`,
              },
            },
          },
          columnMenu: {
            className: `${gComponentPostgresDataTableSmallTypographyClass} gcomponent-postgres-data-table__column-menu`,
          },
          columnsPanel: {
            className: `${gComponentPostgresDataTableSmallTypographyClass} gcomponent-postgres-data-table__columns-panel`,
          },
          filterPanel: gComponentPostgresDataTableFilterPanelSlotProps,
          footer: {
            className: `${gComponentPostgresDataTableSmallTypographyClass} gcomponent-postgres-data-table__footer`,
          },
          loadingOverlay: {
            className: gComponentPostgresDataTableSmallTypographyClass,
          },
          noColumnsOverlay: {
            className: gComponentPostgresDataTableSmallTypographyClass,
          },
          noResultsOverlay: {
            className: gComponentPostgresDataTableSmallTypographyClass,
          },
          noRowsOverlay: {
            className: gComponentPostgresDataTableSmallTypographyClass,
          },
          pagination: {
            className: `${gComponentPostgresDataTableSmallTypographyClass} gcomponent-postgres-data-table__pagination`,
          },
          panel: {
            className: `${gComponentPostgresDataTableSmallTypographyClass} gcomponent-postgres-data-table__panel`,
          },
        }}
      />
    </>
  );
}

function getGComponentPostgresDataTableEmptyFormValue(
  property: GComponentPostgresDataTableResolvedWriteProperty,
): boolean | number | string | null {
  switch (property.valueCodec.codec) {
    case "boolean.standard":
      return false;
    case "number.standard":
      return null;
    default:
      return "";
  }
}

const gComponentPostgresDataTableCodecResults = Symbol(
  "gComponentPostgresDataTableCodecResults",
);

type GComponentPostgresDataTableDecodedValues = Record<string, unknown> &
  Readonly<{
    [gComponentPostgresDataTableCodecResults]?: ReadonlyMap<
      string,
      GProntoFrameworkValueCodecResult
    >;
  }>;

type GComponentPostgresDataTableValueCodecFailure = Extract<
  GProntoFrameworkValueCodecResult,
  Readonly<{ success: false }>
>;

function decodeGComponentPostgresDataTableValue(
  property: GComponentPostgresDataTableResolvedWriteProperty,
  value: unknown,
): Readonly<{
  value: unknown;
  result: GProntoFrameworkValueCodecResult;
}> {
  const result = decodeGProntoFrameworkValue(value, property.valueCodec);

  return {
    value: result.success
      ? result.value
      : getGComponentPostgresDataTableEmptyFormValue(property),
    result,
  };
}

function getGComponentPostgresDataTableWriteDefaultValues(
  properties: readonly GComponentPostgresDataTableResolvedWriteProperty[],
  useLiteralDefaults: boolean,
): GComponentPostgresDataTableDecodedValues {
  const defaultValues: GComponentPostgresDataTableDecodedValues = {};
  const codecResults = new Map<string, GProntoFrameworkValueCodecResult>();

  for (const property of properties) {
    if (
      useLiteralDefaults &&
      property.defaultValue !== null &&
      property.defaultValue !== undefined
    ) {
      const decoded = decodeGComponentPostgresDataTableValue(
        property,
        property.defaultValue,
      );
      defaultValues[property.name] = decoded.value;
      codecResults.set(property.name, decoded.result);
    } else {
      defaultValues[property.name] =
        getGComponentPostgresDataTableEmptyFormValue(property);
    }
  }

  Object.defineProperty(
    defaultValues,
    gComponentPostgresDataTableCodecResults,
    {
      enumerable: false,
      value: codecResults,
    },
  );

  return defaultValues;
}

function getGComponentPostgresDataTableLoadedFormValues(
  properties: readonly GComponentPostgresDataTableResolvedWriteProperty[],
  record: Readonly<Record<string, unknown>>,
): GComponentPostgresDataTableDecodedValues {
  const values: GComponentPostgresDataTableDecodedValues = { ...record };
  const codecResults = new Map<string, GProntoFrameworkValueCodecResult>();

  for (const property of properties) {
    const decoded = decodeGComponentPostgresDataTableValue(
      property,
      record[property.name],
    );
    values[property.name] = decoded.value;
    codecResults.set(property.name, decoded.result);
  }

  Object.defineProperty(values, gComponentPostgresDataTableCodecResults, {
    enumerable: false,
    value: codecResults,
  });

  return values;
}

function renderGComponentPostgresDataTableWriteControl(
  property: GComponentPostgresDataTableResolvedWriteProperty,
  field: ControllerRenderProps<FieldValues, string>,
  error: string | undefined,
  onValueChange: (value: unknown) => void,
  onValueBlur: (value: unknown) => void,
): ReactElement {
  let currentValue: unknown = field.value;
  const handleChange = (value: unknown) => {
    currentValue = value;
    field.onChange(value);
    onValueChange(value);
  };
  const handleBlur = () => {
    field.onBlur();
    onValueBlur(currentValue);
  };

  if (property.inputName === "GComponentInputCheckbox") {
    return (
      <GComponentInput
        kind="checkbox"
        label={property.label}
        required={property.required}
        name={field.name}
        checked={field.value === true}
        onChange={handleChange}
        onBlur={handleBlur}
        controlRef={field.ref}
        error={error}
        helperText={property.helperText}
      />
    );
  }

  if (property.inputName === "GComponentInputNumber") {
    return (
      <GComponentInput
        kind="number"
        label={property.label}
        required={property.required}
        name={field.name}
        step={property.postgresDatatype === "integer" ? 1 : "any"}
        value={typeof field.value === "number" ? field.value : null}
        onChange={handleChange}
        onBlur={handleBlur}
        controlRef={field.ref}
        error={error}
        helperText={property.helperText}
      />
    );
  }

  const value = typeof field.value === "string" ? field.value : "";
  const sharedProperties = {
    label: property.label,
    required: property.required,
    name: field.name,
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    error,
    helperText: property.helperText,
    controlRef: field.ref,
  };

  switch (property.inputName) {
    case "GComponentInputDate":
      return <GComponentInput kind="date" {...sharedProperties} />;
    case "GComponentInputDateTime":
      return <GComponentInput kind="date-time" {...sharedProperties} />;
    case "GComponentInputEmail":
      return <GComponentInput kind="email" {...sharedProperties} />;
    case "GComponentInputText":
      return <GComponentInput kind="text" {...sharedProperties} />;
    case "GComponentInputTextarea":
      return <GComponentInput kind="textarea" {...sharedProperties} />;
    case "GComponentInputUrl":
      return <GComponentInput kind="url" {...sharedProperties} />;
    default:
      throw new Error(
        `Unsupported resolved data-table input "${property.inputName}".`,
      );
  }
}

function renderGComponentPostgresDataTableWriteFields(
  properties: readonly GComponentPostgresDataTableResolvedWriteProperty[],
  control: Control<FieldValues>,
  onValueChange: (
    property: GComponentPostgresDataTableResolvedWriteProperty,
    value: unknown,
  ) => void,
  onValueBlur: (
    property: GComponentPostgresDataTableResolvedWriteProperty,
    value: unknown,
  ) => void,
): ReactElement[] {
  return properties.map((property) => (
    <Controller
      key={property.name}
      control={control}
      name={property.name}
      render={({ field, fieldState }) =>
        renderGComponentPostgresDataTableWriteControl(
          property,
          field,
          fieldState.error?.message,
          (value) => onValueChange(property, value),
          (value) => onValueBlur(property, value),
        )
      }
    />
  ));
}

function resolveGComponentPostgresDataTableWriteMode(
  frameState: GComponentPostgresDataTableOperationFrameState,
): GComponentPostgresDataTableWriteMode | undefined {
  if (frameState.frame === "insert") {
    return {
      frame: "insert",
      context: "insert",
      action: "create",
      recordId: null,
    };
  }

  if (frameState.frame === "edit") {
    return {
      frame: "edit",
      context: "update",
      action: "edit",
      recordId: frameState.recordId,
    };
  }

  return undefined;
}

type GComponentPostgresDataTableWriteFormProps = Readonly<{
  resource: string;
  resolvedResource: GComponentPostgresDataTableResolvedResource;
  mode: GComponentPostgresDataTableWriteMode;
  onSuccess: () => void;
}>;

type GComponentPostgresDataTableRefreshButtonProps = Readonly<{
  resource: string;
  recordId: string | number;
  disabled: boolean;
}>;

function GComponentPostgresDataTableRefreshButton({
  resource,
  recordId,
  disabled,
}: GComponentPostgresDataTableRefreshButtonProps) {
  const { onClick, loading } = useRefreshButton({
    resource,
    id: recordId,
  });

  return (
    <GComponentButton
      variant={
        loading
          ? "secondary-loading"
          : disabled
            ? "secondary-disabled"
            : "secondary"
      }
      text="Refresh"
      onClick={onClick}
      icon="Refresh"
    />
  );
}

function GComponentPostgresDataTableWriteForm({
  resource,
  resolvedResource,
  mode,
  onSuccess,
}: GComponentPostgresDataTableWriteFormProps) {
  const properties =
    mode.context === "insert"
      ? resolvedResource.insertProperties
      : resolvedResource.updateProperties;
  const defaultValues = useMemo(
    () =>
      getGComponentPostgresDataTableWriteDefaultValues(
        properties,
        mode.frame === "insert",
      ),
    [mode.frame, properties],
  );
  const touchedFieldsRef = useRef<Set<string>>(new Set());
  const validationResultsRef = useRef<
    Map<string, GProntoFrameworkValidationResult>
  >(new Map());
  const codecResultsRef = useRef<Map<string, GProntoFrameworkValueCodecResult>>(
    new Map(),
  );
  const decodeFailuresRef = useRef<
    Map<string, GComponentPostgresDataTableValueCodecFailure>
  >(new Map());
  const {
    clearErrors,
    control,
    handleSubmit,
    saveButtonProps,
    setError,
    refineCore: { formLoading, onFinish, query },
  } = useForm({
    defaultValues,
    refineCoreProps: {
      resource,
      action: mode.action,
      redirect: false,
      onMutationSuccess: onSuccess,
      ...(mode.frame === "edit"
        ? {
            id: mode.recordId,
            queryOptions: {
              select: (queryResult) => ({
                ...queryResult,
                data: getGComponentPostgresDataTableLoadedFormValues(
                  properties,
                  queryResult.data,
                ),
              }),
            },
          }
        : {}),
    },
  });

  const applyDecodedCodecResults = (
    results: ReadonlyMap<string, GProntoFrameworkValueCodecResult> | undefined,
  ) => {
    if (results === undefined) {
      return;
    }

    for (const [propertyName, result] of results) {
      codecResultsRef.current.set(propertyName, result);

      if (!result.success) {
        decodeFailuresRef.current.set(propertyName, result);
        setError(propertyName, {
          type: "validate",
          message: result.error.message,
        });
      }
    }
  };

  useEffect(() => {
    applyDecodedCodecResults(
      defaultValues[gComponentPostgresDataTableCodecResults],
    );
  }, [defaultValues]);

  useEffect(() => {
    const loadedValues = query?.data?.data as
      GComponentPostgresDataTableDecodedValues | undefined;

    applyDecodedCodecResults(
      loadedValues?.[gComponentPostgresDataTableCodecResults],
    );
  }, [query?.data?.data]);

  const validateEncodedValue = (
    property: GComponentPostgresDataTableResolvedWriteProperty,
    value: unknown,
  ): GProntoFrameworkValidationResult => {
    const result = validateGProntoFrameworkValue(value, property.validators);
    validationResultsRef.current.set(property.name, result);

    if (result.valid) {
      clearErrors(property.name);
    } else {
      const firstError = result.errors[0];

      if (firstError !== undefined) {
        setError(property.name, {
          type: "validate",
          message: firstError.message,
        });
      }
    }

    return result;
  };

  const encodeAndValidateRenderedValue = (
    property: GComponentPostgresDataTableResolvedWriteProperty,
    value: unknown,
    clearDecodeFailureOnSuccess: boolean,
  ) => {
    const codecResult = encodeGProntoFrameworkValue(value, property.valueCodec);
    codecResultsRef.current.set(property.name, codecResult);

    if (!codecResult.success) {
      setError(property.name, {
        type: "validate",
        message: codecResult.error.message,
      });
      return;
    }

    const validationResult = validateEncodedValue(property, codecResult.value);

    if (validationResult.valid && clearDecodeFailureOnSuccess) {
      decodeFailuresRef.current.delete(property.name);
    }
  };

  const validateRenderedValueAfterChange = (
    property: GComponentPostgresDataTableResolvedWriteProperty,
    value: unknown,
  ) => {
    if (
      touchedFieldsRef.current.has(property.name) ||
      decodeFailuresRef.current.has(property.name)
    ) {
      encodeAndValidateRenderedValue(property, value, true);
    }
  };

  const validateRenderedValueOnBlur = (
    property: GComponentPostgresDataTableResolvedWriteProperty,
    value: unknown,
  ) => {
    touchedFieldsRef.current.add(property.name);
    encodeAndValidateRenderedValue(property, value, false);
  };

  const submitRenderedFieldValues = (event?: BaseSyntheticEvent) => {
    clearErrors();
    void handleSubmit(async (values) => {
      const record: Record<string, unknown> = {};
      let hasCodecError = false;

      for (const property of properties) {
        const result = encodeGProntoFrameworkValue(
          values[property.name],
          property.valueCodec,
        );
        codecResultsRef.current.set(property.name, result);

        if (result.success) {
          record[property.name] = result.value;
        } else {
          hasCodecError = true;
          setError(property.name, {
            type: "validate",
            message: result.error.message,
          });
        }
      }

      if (hasCodecError) {
        return;
      }

      let hasValidationError = false;

      for (const property of properties) {
        const result = validateGProntoFrameworkValue(
          record[property.name],
          property.validators,
        );
        validationResultsRef.current.set(property.name, result);

        if (!result.valid) {
          hasValidationError = true;
          const firstError = result.errors[0];

          if (firstError !== undefined) {
            setError(property.name, {
              type: "validate",
              message: firstError.message,
            });
          }
        } else {
          const decodeFailure = decodeFailuresRef.current.get(property.name);

          if (decodeFailure !== undefined) {
            hasValidationError = true;
            setError(property.name, {
              type: "validate",
              message: decodeFailure.error.message,
            });
          }
        }
      }

      if (hasValidationError) {
        return;
      }

      await onFinish(record);
    })(event).catch(() => undefined);
  };

  const writeForm = (
    <form
      className="gcomponent-postgres-data-table__write-form"
      onSubmit={submitRenderedFieldValues}
    >
      {renderGComponentPostgresDataTableWriteFields(
        properties,
        control,
        validateRenderedValueAfterChange,
        validateRenderedValueOnBlur,
      )}
    </form>
  );
  const saveButton = (
    <GComponentButton
      variant={
        formLoading
          ? "primary-loading"
          : saveButtonProps.disabled
            ? "primary-disabled"
            : "primary"
      }
      text="Save"
      onClick={submitRenderedFieldValues}
    />
  );

  return mode.frame === "insert" ? (
    <Create
      wrapperProps={{ className: "gcomponent-postgres-data-table__write" }}
      headerProps={{
        className: "gcomponent-postgres-data-table__write-header",
      }}
      contentProps={{
        className: "gcomponent-postgres-data-table__write-content",
      }}
      footerButtonProps={{
        className: "gcomponent-postgres-data-table__write-actions",
      }}
      title={
        <GComponentTypography text={resolvedResource.label} variant="h2" />
      }
      isLoading={formLoading}
      breadcrumb={false}
      goBack={false}
      footerButtons={saveButton}
    >
      {writeForm}
    </Create>
  ) : (
    <Edit
      wrapperProps={{ className: "gcomponent-postgres-data-table__write" }}
      headerProps={{
        className: "gcomponent-postgres-data-table__write-header",
      }}
      contentProps={{
        className: "gcomponent-postgres-data-table__write-content",
      }}
      footerButtonProps={{
        className: "gcomponent-postgres-data-table__write-actions",
      }}
      title={
        <GComponentTypography text={resolvedResource.label} variant="h2" />
      }
      resource={resource}
      recordItemId={mode.recordId}
      isLoading={formLoading}
      breadcrumb={false}
      goBack={false}
      canDelete={false}
      headerButtons={
        <GComponentPostgresDataTableRefreshButton
          resource={resource}
          recordId={mode.recordId}
          disabled={formLoading}
        />
      }
      footerButtons={saveButton}
    >
      {writeForm}
    </Edit>
  );
}

type GComponentPostgresDataTableOperationFrameProps = Readonly<{
  frameState: GComponentPostgresDataTableOperationFrameState;
  resource: string;
  resolvedResource: GComponentPostgresDataTableResolvedResource;
  onBackToTable: () => void;
}>;

type GComponentPostgresDataTableViewFrameProps = Readonly<{
  recordId: string | number;
  resource: string;
  resolvedResource: GComponentPostgresDataTableResolvedResource;
  onBackToTable: () => void;
}>;

function GComponentPostgresDataTableViewFrame({
  recordId,
  resource,
  resolvedResource,
  onBackToTable,
}: GComponentPostgresDataTableViewFrameProps) {
  const { query, result } = useOne<Record<string, unknown>>({
    resource,
    id: recordId,
    dataProviderName: gProntoFrameworkSupabaseDataProviderName,
  });
  let content: ReactElement;

  if (query.isLoading || query.isPending || query.isFetching) {
    content = <GComponentLoader label="Loading record." />;
  } else if (query.isError || result === undefined || result === null) {
    content = (
      <GComponentAlert color="red" message="The record could not be loaded." />
    );
  } else {
    content = (
      <GComponentFlow direction="vertical">
        {resolvedResource.properties.map((property) => {
          const formattedValue = formatGProntoFrameworkValue(
            result[property.name],
            property.format,
          );

          return (
            <GComponentFlow key={property.name} direction="horizontal">
              <GComponentTypography text={property.label} variant="small" />
              <GComponentTypography
                text={formattedValue === undefined ? "" : formattedValue}
                variant="normal"
              />
            </GComponentFlow>
          );
        })}
      </GComponentFlow>
    );
  }

  return (
    <GComponentFlow direction="vertical">
      <GComponentTypography text="View" variant="h2" />
      <GComponentButton
        variant="secondary"
        text="Back to table"
        onClick={onBackToTable}
        icon={null}
      />
      {content}
    </GComponentFlow>
  );
}

type GComponentPostgresDataTableDeleteFrameProps = Readonly<{
  recordId: string | number;
  resource: string;
  resolvedResource: GComponentPostgresDataTableResolvedResource;
  onBackToTable: () => void;
}>;

function GComponentPostgresDataTableDeleteFrame({
  recordId,
  resource,
  resolvedResource,
  onBackToTable,
}: GComponentPostgresDataTableDeleteFrameProps) {
  const { mutate } = useDelete();
  const deleteRequestLockedRef = useRef(false);
  const [deletePending, setDeletePending] = useState(false);
  const recordIdText = String(recordId);
  const handleBackToTable = () => {
    if (!deleteRequestLockedRef.current) {
      onBackToTable();
    }
  };
  const handleDelete = () => {
    if (deleteRequestLockedRef.current) {
      return;
    }

    deleteRequestLockedRef.current = true;
    setDeletePending(true);
    mutate(
      {
        resource,
        id: recordId,
        mutationMode: "pessimistic",
        dataProviderName: gProntoFrameworkSupabaseDataProviderName,
      },
      {
        onSuccess: () => {
          onBackToTable();
        },
        onError: () => {
          deleteRequestLockedRef.current = false;
          setDeletePending(false);
        },
      },
    );
  };

  return (
    <GComponentFlow direction="vertical">
      <GComponentTypography text="Delete" variant="h2" />
      <GComponentFlow direction="horizontal">
        <GComponentTypography
          text={resolvedResource.idColumnName}
          variant="small"
        />
        <GComponentTypography text={recordIdText} variant="normal" />
      </GComponentFlow>
      <GComponentTypography
        text={`Delete record "${recordIdText}"? This action cannot be undone.`}
        variant="normal"
      />
      <GComponentFlow direction="horizontal">
        <GComponentButton
          variant={deletePending ? "secondary-disabled" : "secondary"}
          text="Back to table"
          onClick={handleBackToTable}
          icon={null}
        />
        <GComponentButton
          variant={deletePending ? "danger-loading" : "danger"}
          text="Delete record"
          onClick={handleDelete}
        />
      </GComponentFlow>
    </GComponentFlow>
  );
}

function GComponentPostgresDataTableOperationFrame({
  frameState,
  resource,
  resolvedResource,
  onBackToTable,
}: GComponentPostgresDataTableOperationFrameProps) {
  if (frameState.frame === "view") {
    return (
      <GComponentPostgresDataTableViewFrame
        key={JSON.stringify([resource, frameState.recordId])}
        recordId={frameState.recordId}
        resource={resource}
        resolvedResource={resolvedResource}
        onBackToTable={onBackToTable}
      />
    );
  }

  if (frameState.frame === "delete") {
    return (
      <GComponentPostgresDataTableDeleteFrame
        key={JSON.stringify([resource, frameState.recordId])}
        recordId={frameState.recordId}
        resource={resource}
        resolvedResource={resolvedResource}
        onBackToTable={onBackToTable}
      />
    );
  }

  const { frame } = frameState;
  const heading = `${frame.charAt(0).toUpperCase()}${frame.slice(1)}`;
  const writeMode = resolveGComponentPostgresDataTableWriteMode(frameState);

  return (
    <GComponentFlow direction="vertical">
      <GComponentTypography text={heading} variant="h2" />
      <GComponentButton
        variant="secondary"
        text="Back to table"
        onClick={onBackToTable}
        icon={null}
      />
      {writeMode === undefined ? null : (
        <GComponentPostgresDataTableWriteForm
          resource={resource}
          resolvedResource={resolvedResource}
          mode={writeMode}
          onSuccess={onBackToTable}
        />
      )}
    </GComponentFlow>
  );
}

function GComponentPostgresDataTableResolvedResource({
  resource,
  defaults,
}: GComponentPostgresDataTableProps) {
  const publicProperties = useSyncExternalStore(
    subscribeToGProntoFrameworkApplicationRootPublicProperties,
    getGProntoFrameworkApplicationRootPublicPropertiesSnapshot,
  );
  const authUserId = publicProperties.User.AuthUserId;
  const [frameState, setFrameState] =
    useState<GComponentPostgresDataTableFrameState>(
      gComponentPostgresDataTableInitialFrameState,
    );
  const effectiveDefaults = JSON.stringify(defaults ?? null);
  const resolvedResource = useMemo(
    () => resolveGComponentPostgresDataTableResource(resource, defaults),
    [effectiveDefaults, resource],
  );

  return (
    <div className="gcomponent-postgres-data-table">
      <div hidden={frameState.frame !== "table"}>
        <GComponentPostgresDataTableTableFrame
          key={JSON.stringify([resource, effectiveDefaults, authUserId])}
          authUserId={authUserId}
          resource={resource}
          resolvedResource={resolvedResource}
          onFrameChange={setFrameState}
        />
      </div>
      {frameState.frame === "table" ? null : (
        <GComponentPostgresDataTableOperationFrame
          frameState={frameState}
          resource={resource}
          resolvedResource={resolvedResource}
          onBackToTable={() =>
            setFrameState(gComponentPostgresDataTableInitialFrameState)
          }
        />
      )}
    </div>
  );
}

export function GComponentPostgresDataTable(
  props: GComponentPostgresDataTableProps,
) {
  return (
    <GComponentPostgresDataTableResolvedResource
      key={props.resource}
      {...props}
    />
  );
}
