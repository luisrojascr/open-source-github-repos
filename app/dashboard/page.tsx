import { Suspense } from "react";
import { ApiKeyList } from "./components/api-key-list";
import { CreateApiKeyButton } from "./components/create-api-key-button";
import { DashboardHeader } from "./components/dashboard-header";
import { LoadingApiKeys } from "./components/loading-api-keys";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <DashboardHeader />

      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">API Keys</h2>
          <CreateApiKeyButton />
        </div>

        <Suspense fallback={<LoadingApiKeys />}>
          <ApiKeyList />
        </Suspense>
      </div>
    </div>
  );
}
