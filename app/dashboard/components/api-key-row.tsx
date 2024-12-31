"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

type ApiKeyRowProps = {
  apiKey: {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    lastUsed: string | null;
  };
  onDelete: () => void;
  onRevoke: () => void;
};

export function ApiKeyRow({ apiKey, onDelete, onRevoke }: ApiKeyRowProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="p-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{apiKey.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
            {isVisible ? apiKey.key : "••••••••••••••••"}
          </code>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Created {formatDistanceToNow(new Date(apiKey.createdAt))} ago
          {apiKey.lastUsed &&
            ` • Last used ${formatDistanceToNow(
              new Date(apiKey.lastUsed)
            )} ago`}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRevoke}
          className="px-3 py-1 text-sm rounded-md border hover:bg-muted"
        >
          Revoke
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm rounded-md border border-destructive text-destructive hover:bg-destructive/10"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
