"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

// Validation schema
const createApiKeySchema = z.object({
  name: z
    .string()
    .min(1, "Key name is required")
    .max(50, "Key name must be less than 50 characters"),
  limit: z
    .number()
    .transform(Number)
    .refine((n) => !isNaN(n), "Must be a valid number")
    .refine((n) => n > 0, "Limit must be greater than 0")
    .refine((n) => n <= 1000000, "Limit cannot exceed 1,000,000"),
});

type FormData = z.infer<typeof createApiKeySchema>;

export function CreateApiKeyDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: "",
      limit: 1000,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      console.log("Submitting form data:", data);
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          limit: data.limit,
        }),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create API key");
      }

      router.refresh();
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating API key:", error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new API key</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Key Name — A unique name to identify this key
            </Label>
            <Input id="name" placeholder="Key Name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="limit">Limit monthly usage*</Label>
            <Input id="limit" type="number" {...register("limit")} />
            {errors.limit && (
              <p className="text-sm text-red-500">{errors.limit.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              * If the combined usage of all your keys exceeds your plan&apos;s
              limit, all requests will be rejected.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
