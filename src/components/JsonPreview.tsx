import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Code2, Check } from "lucide-react";
import { SchemaField } from "@/types/schema";
import { convertToJson } from "@/utils/schemaUtils";
import { useToast } from "@/hooks/use-toast";

interface JsonPreviewProps {
  fields: SchemaField[];
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ fields }) => {
  const jsonOutput = convertToJson(fields);
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
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
  };

  const handleDownload = () => {
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
  };

  return (
    <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            JSON Preview
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">
            Real-time preview of your JSON schema structure
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="default"
            onClick={handleCopy}
            className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={handleDownload}
            className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 px-6 py-3 text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8 flex-1 overflow-hidden">
        <div className="relative h-full">
          <pre className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl overflow-auto text-base font-mono whitespace-pre-wrap border-2 border-gray-200/50 dark:border-gray-700/50 shadow-inner h-full leading-relaxed">
            {JSON.stringify(jsonOutput, null, 2)}
          </pre>
          {Object.keys(jsonOutput).length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/90 dark:bg-gray-800/90 rounded-xl">
              <div className="text-center">
                <Code2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                  No schema defined
                </p>
                <p className="text-base text-gray-400 dark:text-gray-500 mt-2">
                  Add fields to see the JSON preview
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
