"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Image,
  Code,
  Download,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Artifact } from "@/store/workbench-store";
import { useState } from "react";

interface ArtifactDisplayProps {
  artifact: Artifact;
  showActions?: boolean;
  onTransfer?: (artifactId: string) => void;
  onView?: (artifact: Artifact) => void;
}

const getArtifactIcon = (type: string) => {
  switch (type) {
    case "markdown":
      return <FileText className="w-4 h-4" />;
    case "image/png":
      return <Image className="w-4 h-4" />;
    case "json":
      return <Code className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getArtifactTypeLabel = (type: string) => {
  switch (type) {
    case "markdown":
      return "Markdown";
    case "image/png":
      return "Image";
    case "json":
      return "JSON";
    default:
      return "Document";
  }
};

const getArtifactTypeColor = (type: string) => {
  switch (type) {
    case "markdown":
      return "bg-blue-100 text-blue-800";
    case "image/png":
      return "bg-green-100 text-green-800";
    case "json":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ArtifactDisplay({
  artifact,
  showActions = true,
  onTransfer,
  onView,
}: ArtifactDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleView = () => {
    if (onView) {
      onView(artifact);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleDownload = () => {
    if (artifact.content) {
      const blob = new Blob([artifact.content], {
        type: artifact.type === "markdown" ? "text/markdown" : "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = artifact.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getArtifactIcon(artifact.type)}
            <CardTitle className="text-sm font-medium">
              {artifact.name}
            </CardTitle>
          </div>
          <Badge className={`text-xs ${getArtifactTypeColor(artifact.type)}`}>
            {getArtifactTypeLabel(artifact.type)}
          </Badge>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Created by {artifact.creator} • {artifact.createdAt.toLocaleString()}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isExpanded && artifact.content && (
          <div className="mb-3 p-2 bg-gray-50 rounded text-xs font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
            {artifact.content.substring(0, 500)}
            {artifact.content.length > 500 && "..."}
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={handleView}
              className="text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              {isExpanded ? "Hide" : "View"}
            </Button>

            {artifact.content && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                className="text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            )}

            {onTransfer && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onTransfer(artifact.id)}
                className="text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Transfer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
