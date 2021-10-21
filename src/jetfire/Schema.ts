export type ColumnSchema = {
  name: string;
  sqlType: string;
  nullable: boolean;
};

export type RowSchema = ColumnSchema[];
