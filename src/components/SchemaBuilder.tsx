import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Code2, Layers3, Download, Copy, Check } from "lucide-react";
import { SchemaField } from "./SchemaField";
import { JsonPreview } from "./JsonPreview";
import { SchemaField as SchemaFieldType, SchemaFormData } from "@/types/schema";
import {
  createDefaultField,
  updateFieldById,
  removeFieldById,
  addFieldToParent,
  convertToJson,
} from "@/utils/schemaUtils";
import { useToast } from "@/hooks/use-toast";

export const SchemaBuilder: React.FC = () => {
  const [fields, setFields] = useState<SchemaFieldType[]>([
    createDefaultField(),
  ]);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { control, handleSubmit } = useForm<SchemaFormData>({
    defaultValues: {
      fields: fields,
    },
  });

  const handleUpdateField = useCallback(
    (id: string, updates: Partial<SchemaFieldType>) => {
      setFields((prev) => updateFieldById(prev, id, updates));
    },
    []
  );

  const handleDeleteField = useCallback((id: string) => {
    setFields((prev) => {
      const updated = removeFieldById(prev, id);
      // If here no fields remain, then add a default one .
      return updated.length === 0 ? [createDefaultField()] : updated;
    });
  }, []);

  const handleAddField = useCallback(() => {
    setFields((prev) => [...prev, createDefaultField()]);
  }, []);

  const handleAddNestedField = useCallback((parentId: string) => {
    const newField = createDefaultField();
    setFields((prev) => addFieldToParent(prev, parentId, newField));
  }, []);

  const handleCopyJson = useCallback(async () => {
    const jsonOutput = convertToJson(fields);
    const jsonString = JSON.stringify(jsonOutput, null, 2);

    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "JSON schema has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  }, [fields, toast]);

  const handleDownloadJson = useCallback(() => {
    const jsonOutput = convertToJson(fields);
    const jsonString = JSON.stringify(jsonOutput, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Your JSON schema is being downloaded.",
    });
  }, [fields, toast]);
  const onSubmit = (data: SchemaFormData) => {
    console.log("Schema data:", data);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-lg">
        <div className="w-full px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Code2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  HROne JSON Schema Builder
                </h1>
                <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                  Created by Shubham Gupta
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="default"
                onClick={handleCopyJson}
                className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy JSON"}
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={handleDownloadJson}
                className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 px-6 py-3 text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-120px)] p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Schema Builder Section */}
          <div className="h-full flex flex-col overflow-hidden">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                      <Layers3 className="h-6 w-6 text-white" />
                    </div>
                    Schema Fields
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">
                    Define your JSON structure by adding and configuring fields
                  </p>
                </div>
                <Button
                  onClick={handleAddField}
                  className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 px-6 py-3 text-base font-medium"
                >
                  <Plus className="h-5 w-5" />
                  Add Field
                </Button>
              </CardHeader>
              <CardContent className="p-8 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto space-y-6 pr-2">
                  {fields.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <Layers3 className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        No fields defined
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-8 text-base">
                        Get started by adding your first field to the schema
                      </p>
                      <Button
                        onClick={handleAddField}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 text-base font-medium"
                      >
                        <Plus className="h-5 w-5 mr-3" />
                        Add Your First Field
                      </Button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {fields.map((field, index) => (
                        <SchemaField
                          key={field.id}
                          field={field}
                          fieldIndex={index}
                          control={control}
                          onUpdateField={handleUpdateField}
                          onDeleteField={handleDeleteField}
                          onAddNestedField={handleAddNestedField}
                        />
                      ))}
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* JSON Preview Section */}
          <div className="h-full overflow-hidden">
            <JsonPreview fields={fields} />
          </div>
        </div>
      </div>
    </div>
  );
};
