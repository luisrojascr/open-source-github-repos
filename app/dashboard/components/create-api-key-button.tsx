"use client";

import { useState } from "react";

export function CreateApiKeyButton() {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      // TODO: Implement API key creation
      // const response = await fetch('/api/keys', {
      //   method: 'POST',
      //   body: JSON.stringify({ name: 'New API Key' })
      // })
    } catch (error) {
      console.error("Failed to create API key:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleCreate}
      disabled={isCreating}
      className="px-4 py-2 rounded-md bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isCreating ? "Creating..." : "Create API Key"}
    </button>
  );
}
