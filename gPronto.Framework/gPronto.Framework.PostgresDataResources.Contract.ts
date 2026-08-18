import type { GProntoFrameworkValidationDescriptor } from "./gPronto.Framework.DataResources.ValidationContract";

export type GProntoFrameworkPostgresDataContractSchemaColumn = Readonly<
  Record<string, unknown> & {
    readonly validation?: Readonly<
      Record<string, unknown> & {
        readonly validators?: readonly GProntoFrameworkValidationDescriptor[];
      }
    >;
  }
>;

export type GProntoFrameworkPostgresDataContractSchema = {
  readonly gPostgresDataContract_Schema_Version: number;
  readonly title: string;
  readonly description: string | null;
  readonly columns: Record<
    string,
    GProntoFrameworkPostgresDataContractSchemaColumn
  >;
};

export type GProntoFrameworkPostgresDataResourceDefinition = {
  readonly name: string;
  readonly identifier: string;
  readonly meta: {
    readonly label: string;
    readonly dataProviderName: "supabase";
    readonly schema: "public";
    readonly idColumnName: string;
    readonly gPronto: {
      readonly postgresDataContractSchema: GProntoFrameworkPostgresDataContractSchema;
    };
  };
};
