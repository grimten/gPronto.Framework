import type {
  GProntoFrameworkPostgresDataContractSchema,
  GProntoFrameworkPostgresDataResourceDefinition,
} from "./gPronto.Framework.PostgresDataResources.Contract";

export function defineGProntoFrameworkPostgresDataResource(
  identifier: string,
  postgresDataContractSchema: GProntoFrameworkPostgresDataContractSchema,
): GProntoFrameworkPostgresDataResourceDefinition {
  const name = identifier.replace(/^postgres_/, "").replace(/_v\d+$/, "");

  let idColumnName = "id";
  for (const [columnName, column] of Object.entries(
    postgresDataContractSchema.columns,
  )) {
    if (column.isIdColumn === true) {
      idColumnName = columnName;
      break;
    }
  }

  return {
    name,
    identifier,
    meta: {
      label: `${postgresDataContractSchema.title}s`,
      dataProviderName: "supabase",
      schema: "public",
      idColumnName,
      gPronto: { postgresDataContractSchema },
    },
  };
}
