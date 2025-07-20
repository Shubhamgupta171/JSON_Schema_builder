import { SchemaField, JsonOutput } from "@/types/schema";

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const createDefaultField = (
  type: SchemaField["type"] = "string"
): SchemaField => {
  return {
    id: generateUniqueId(),
    key: "",
    type,
    children: type === "nested" ? [] : undefined,
  };
};

export const convertToJson = (fields: SchemaField[]): JsonOutput => {
  const result: JsonOutput = {};

  fields.forEach((field) => {
    if (!field.key.trim()) return;

    switch (field.type) {
      case "string":
        result[field.key] = "string";
        break;
      case "number":
        result[field.key] = 0;
        break;
      case "boolean":
        result[field.key] = false;
        break;
      case "float":
        result[field.key] = 0.0;
        break;
      case "objectID":
        result[field.key] = "507f1f77bcf86cd799439011";
        break;
      case "nested":
        if (field.children && field.children.length > 0) {
          result[field.key] = convertToJson(field.children);
        } else {
          result[field.key] = {};
        }
        break;
    }
  });

  return result;
};

export const findFieldById = (
  fields: SchemaField[],
  id: string
): SchemaField | null => {
  for (const field of fields) {
    if (field.id === id) {
      return field;
    }
    if (field.children) {
      const found = findFieldById(field.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const removeFieldById = (
  fields: SchemaField[],
  id: string
): SchemaField[] => {
  return fields.filter((field) => {
    if (field.id === id) {
      return false;
    }
    if (field.children) {
      field.children = removeFieldById(field.children, id);
    }
    return true;
  });
};

export const updateFieldById = (
  fields: SchemaField[],
  id: string,
  updates: Partial<SchemaField>
): SchemaField[] => {
  return fields.map((field) => {
    if (field.id === id) {
      const updatedField = { ...field, ...updates };
      // If type changes to nested and doesn't have children, add empty array
      if (updatedField.type === "nested" && !updatedField.children) {
        updatedField.children = [];
      }
      // If type changes from nested, remove children
      if (updatedField.type !== "nested") {
        delete updatedField.children;
      }
      return updatedField;
    }
    if (field.children) {
      return {
        ...field,
        children: updateFieldById(field.children, id, updates),
      };
    }
    return field;
  });
};

export const addFieldToParent = (
  fields: SchemaField[],
  parentId: string,
  newField: SchemaField
): SchemaField[] => {
  return fields.map((field) => {
    if (field.id === parentId && field.type === "nested") {
      return {
        ...field,
        children: [...(field.children || []), newField],
      };
    }
    if (field.children) {
      return {
        ...field,
        children: addFieldToParent(field.children, parentId, newField),
      };
    }
    return field;
  });
};
