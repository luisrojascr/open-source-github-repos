"use client";

import { useState } from "react";
import { ApiKeyRow } from "./api-key-row";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
};

export function ApiKeyList() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const handleDelete = async (id: string) => {
    // TODO: Implement delete functionality
    setApiKeys((keys) => keys.filter((key) => key.id !== id));
  };

  const handleRevoke = async (id: string) => {
    // TODO: Implement revoke functionality
    setApiKeys((keys) =>
      keys.map((key) => (key.id === id ? { ...key, revoked: true } : key))
    );
  };

  if (apiKeys.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/50">
        <p className="text-muted-foreground">
          No API keys found. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg divide-y">
      {apiKeys.map((apiKey) => (
        <ApiKeyRow
          key={apiKey.id}
          apiKey={apiKey}
          onDelete={() => handleDelete(apiKey.id)}
          onRevoke={() => handleRevoke(apiKey.id)}
        />
      ))}
    </div>
  );
}
