export interface SchemaField {
  id: string;
  key: string;
  type: 'string' | 'number' | 'boolean' | 'float' | 'objectID' | 'nested';
  children?: SchemaField[];
}

export interface SchemaFormData {
  fields: SchemaField[];
}

export interface JsonOutput {
  [key: string]: unknown;
}