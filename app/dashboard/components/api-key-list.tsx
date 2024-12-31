"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EyeOpenIcon,
  ClipboardCopyIcon,
  UpdateIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  usage: number;
  limit: number;
  created_at: string;
}

export function ApiKeyList({ keys }: { keys: ApiKey[] }) {
  const [visibleKey, setVisibleKey] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      description: "API key copied to clipboard",
    });
  };

  const formatKey = (key: string) => {
    return visibleKey === key ? key : `${key.slice(0, 8)}${"•".repeat(32)}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>NAME</TableHead>
          <TableHead>USAGE</TableHead>
          <TableHead>KEY</TableHead>
          <TableHead className="text-right">OPTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keys.map((key) => (
          <TableRow key={key.id}>
            <TableCell className="font-medium">{key.name}</TableCell>
            <TableCell>{key.usage}</TableCell>
            <TableCell className="font-mono">{formatKey(key.key)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setVisibleKey(visibleKey === key.key ? null : key.key)
                  }
                >
                  <EyeOpenIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(key.key)}
                >
                  <ClipboardCopyIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // TODO: Implement key rotation
                  }}
                >
                  <UpdateIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // TODO: Implement key deletion
                  }}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
