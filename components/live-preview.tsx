// components/live-preview.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  Eye,
  Code2,
  Zap,
  Terminal,
} from "lucide-react";

interface LivePreviewProps {
  code: string;
  installedPackages?: string[];
  isStreaming?: boolean;
}

export function LivePreview({
  code,
  installedPackages = [],
  isStreaming,
}: LivePreviewProps) {
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [key, setKey] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const refreshPreview = () => {
    setIsRefreshing(true);
    setKey((prev) => prev + 1);
    setConsoleLogs([]);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  // Strip markdown fences if present
  const cleanedCode = code
    .replace(/^```[a-z]*\n?/gi, "")
    .replace(/```$/, "")
    .trim();

  const captureConsoleScript = `
    (function() {
      const log = console.log;
      console.log = function(...args) {
        window.parent.postMessage({ type: 'log', args }, '*');
        log.apply(console, args);
      };
    })();
  `;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-green-600" />
          <span className="font-medium">Real Code Preview</span>
          <Badge variant="secondary" className="gap-1">
            <Code2 className="h-3 w-3" />
            TypeScript
          </Badge>
          {code && (
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3 text-green-500" />
              Live Execution
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md">
            <Button variant={previewMode === "desktop" ? "default" : "ghost"} size="sm" onClick={() => setPreviewMode("desktop")} className="rounded-r-none">
              <Monitor className="h-4 w-4" />
            </Button>
            <Button variant={previewMode === "tablet" ? "default" : "ghost"} size="sm" onClick={() => setPreviewMode("tablet")} className="rounded-none border-x">
              <Tablet className="h-4 w-4" />
            </Button>
            <Button variant={previewMode === "mobile" ? "default" : "ghost"} size="sm" onClick={() => setPreviewMode("mobile")} className="rounded-l-none">
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={refreshPreview} disabled={isRefreshing || !code}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        {!code ? (
          <div className="h-full flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 text-center">
                <Eye className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Component to Preview</h3>
                <p className="text-gray-600 mb-4">Generate some code first to see the live preview</p>
                <div className="flex items-center gap-2 justify-center">
                  <Zap className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Real code execution with full interactivity</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex flex-col gap-4">
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-lg overflow-auto" style={{ width: getPreviewWidth(), maxWidth: "100%", height: "400px" }}>
                <iframe
                  key={key}
                  sandbox="allow-scripts allow-same-origin"
                  style={{ width: "100%", height: "100%", border: "none" }}
                  srcDoc={`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Preview</title>
    <script type="module">
      import React from "https://cdn.skypack.dev/react";
      import ReactDOM from "https://cdn.skypack.dev/react-dom/client";
      const exports = {};
      ${captureConsoleScript}
      ${cleanedCode}
      const rootElement = document.getElementById("root");
      if (exports.default) {
        ReactDOM.createRoot(rootElement).render(React.createElement(exports.default));
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`}
                />
              </div>
            </div>

            <div className="bg-black text-green-400 text-sm p-2 rounded font-mono flex-1">
              <div className="flex items-center gap-2 mb-1 text-gray-400">
                <Terminal className="w-4 h-4" /> Console Output:
              </div>
              <div className="overflow-y-auto max-h-40">
                {consoleLogs.length === 0 ? (
                  <div className="text-gray-500 italic">No logs yet...</div>
                ) : (
                  consoleLogs.map((log, index) => <div key={index}>{log}</div>)
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t bg-gray-50 text-xs text-gray-600 flex items-center justify-between">
        <span>Preview Mode: {previewMode} • Real Code Execution</span>
        <span>React 18 • TypeScript • Tailwind CSS</span>
      </div>

      {/* Log Listener */}
      <script suppressHydrationWarning>
        {typeof window !== "undefined" &&
          window.addEventListener("message", (event) => {
            if (event.data.type === "log") {
              setConsoleLogs((prev) => [...prev, event.data.args.join(" ")]);
            }
          })}
      </script>
    </div>
  );
}
