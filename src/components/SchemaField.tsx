import React from "react";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trash2,
  Plus,
  Type,
  Hash,
  Layers,
  GripVertical,
  ToggleLeft,
  Calculator,
  Key,
} from "lucide-react";
import { SchemaField as SchemaFieldType, SchemaFormData } from "@/types/schema";

interface SchemaFieldProps {
  field: SchemaFieldType;
  fieldIndex: number;
  control: Control<SchemaFormData>;
  onUpdateField: (id: string, updates: Partial<SchemaFieldType>) => void;
  onDeleteField: (id: string) => void;
  onAddNestedField: (parentId: string) => void;
  level?: number;
  parentPath?: string;
}

export const SchemaField: React.FC<SchemaFieldProps> = ({
  field,
  fieldIndex,
  control,
  onUpdateField,
  onDeleteField,
  onAddNestedField,
  level = 0,
  parentPath = "fields",
}) => {
  const currentPath = `${parentPath}.${fieldIndex}`;

  const handleKeyChange = (value: string) => {
    onUpdateField(field.id, { key: value });
  };

  const handleTypeChange = (value: SchemaFieldType["type"]) => {
    onUpdateField(field.id, { type: value });
  };

  const handleDelete = () => {
    onDeleteField(field.id);
  };

  const handleAddNested = () => {
    onAddNestedField(field.id);
  };

  const getTypeIcon = (type: SchemaFieldType["type"]) => {
    switch (type) {
      case "string":
        return <Type className="h-4 w-4" />;
      case "number":
        return <Hash className="h-4 w-4" />;
      case "boolean":
        return <ToggleLeft className="h-4 w-4" />;
      case "float":
        return <Calculator className="h-4 w-4" />;
      case "objectID":
        return <Key className="h-4 w-4" />;
      case "nested":
        return <Layers className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: SchemaFieldType["type"]) => {
    switch (type) {
      case "string":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800";
      case "number":
        return "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800";
      case "boolean":
        return "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800";
      case "float":
        return "text-cyan-600 bg-cyan-50 border-cyan-200 dark:text-cyan-400 dark:bg-cyan-900/20 dark:border-cyan-800";
      case "objectID":
        return "text-pink-600 bg-pink-50 border-pink-200 dark:text-pink-400 dark:bg-pink-900/20 dark:border-pink-800";
      case "nested":
        return "text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-800";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800";
    }
  };
  return (
    <Card
      className={`group transition-all duration-200 hover:shadow-lg ${
        level > 0
          ? "ml-8 border-l-4 border-l-gradient-to-b from-blue-400 to-indigo-400 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10"
          : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
      } ${level > 0 ? "shadow-sm" : "shadow-md"}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Drag Handle */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <GripVertical className="h-5 w-5 text-gray-400 cursor-grab active:cursor-grabbing" />
          </div>

          {/* Field Name Input */}
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Field name"
                value={field.key}
                onChange={(e) => handleKeyChange(e.target.value)}
                className="font-medium text-lg border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 pl-4 pr-4 py-3 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Type Selector */}
          <div className="w-40">
            <Select value={field.type} onValueChange={handleTypeChange}>
              <SelectTrigger
                className={`border-2 transition-all duration-200 ${getTypeColor(
                  field.type
                )} font-medium`}
              >
                <div className="flex items-center gap-2">
                  {getTypeIcon(field.type)}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                <SelectItem value="string" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-green-600" />
                    String
                  </div>
                </SelectItem>
                <SelectItem value="number" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-blue-600" />
                    Number
                  </div>
                </SelectItem>
                <SelectItem value="boolean" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <ToggleLeft className="h-4 w-4 text-orange-600" />
                    Boolean
                  </div>
                </SelectItem>
                <SelectItem value="float" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-cyan-600" />
                    Float
                  </div>
                </SelectItem>
                <SelectItem
                  value="objectID"
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-pink-600" />
                    ObjectID
                  </div>
                </SelectItem>
                <SelectItem value="nested" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-600" />
                    Nested
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/*  Here Action Buttons We added*/}
          <div className="flex gap-3">
            {field.type === "nested" && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleAddNested}
                className="px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Nested Fields */}
        {field.type === "nested" &&
          field.children &&
          field.children.length > 0 && (
            <div className="mt-6 space-y-4 relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-400 to-indigo-400 opacity-30"></div>
              {field.children.map((childField, childIndex) => (
                <SchemaField
                  key={childField.id}
                  field={childField}
                  fieldIndex={childIndex}
                  control={control}
                  onUpdateField={onUpdateField}
                  onDeleteField={onDeleteField}
                  onAddNestedField={onAddNestedField}
                  level={level + 1}
                  parentPath={`${currentPath}.children`}
                />
              ))}
            </div>
          )}

        {/* Empty Nested State */}
        {field.type === "nested" &&
          (!field.children || field.children.length === 0) && (
            <div className="mt-6 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 text-center">
              <Layers className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                No nested fields yet
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddNested}
                className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Nested Field
              </Button>
            </div>
          )}
      </CardContent>
    </Card>
  );
};
