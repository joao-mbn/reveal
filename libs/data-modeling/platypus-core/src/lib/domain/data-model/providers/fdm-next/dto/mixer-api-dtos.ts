export interface GraphQlDmlVersionDTO {
  space: string;
  externalId: string;
  version: string;
  previousVersion?: string;
  name?: string;
  description?: string;
  graphQlDml?: string;
  createdTime?: string | number;
  lastUpdatedTime?: string | number;
  views: {
    externalId: string;
    version: string;
  }[];
}

export interface UpsertDataModelResult {
  errors: Error[] | null;
  result: GraphQlDmlVersionDTO;
}

type Error = {
  kind: string;
  message: string;
  hint: string;
  location: SourceLocationRange;
};

type SourceLocationRange = {
  start: SourceLocation;
  end?: SourceLocation;
};

type SourceLocation = {
  line: number;
  column: number;
  offset?: number;
};
