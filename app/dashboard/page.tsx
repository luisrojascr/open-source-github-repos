import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ApiKeyList } from "./components/api-key-list";
import { CreateApiKeyButton } from "./components/create-api-key-button";
import { DashboardHeader } from "./components/dashboard-header";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  // Fetch API keys directly from Supabase
  const { data: keys, error } = await supabase
    .from("api_keys")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching API keys:", error);
    // Handle error appropriately
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <DashboardHeader />

      {/* Current Plan Card */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-rose-100 via-purple-100 to-blue-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              CURRENT PLAN
            </div>
            <h2 className="text-3xl font-semibold text-foreground">
              Researcher
            </h2>
          </div>
          <Button variant="secondary" className="bg-white hover:bg-gray-100">
            Manage Plan
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">API Limit</div>
            <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <Progress value={0} className="h-2" />
          <div className="text-sm text-muted-foreground">0/1,000 Requests</div>
        </div>
      </Card>

      {/* API Keys Section */}
      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <p className="text-sm text-muted-foreground">
              The key is used to authenticate your requests to the Research API.
              To learn more, see the documentation page.
            </p>
          </div>
          <CreateApiKeyButton />
        </div>

        <ApiKeyList keys={keys || []} />
      </div>

      {/* Usage Alerts */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold mb-2">Email usage alerts</h3>
        <p className="text-sm text-muted-foreground mb-4">
          An alert will be sent to your email when your monthly usage reaches
          the set threshold.
        </p>
        <div className="flex items-center gap-2">
          <div className="text-sm">
            Your alert threshold is currently set to:
          </div>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            90%
          </div>
          <Button variant="ghost" size="sm" className="h-8">
            <InfoCircledIcon className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Contact Section */}
      <div className="mt-8 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Have any questions, feedback or need support? We&apos;d love to hear
          from you!
        </p>
        <Button variant="outline">Contact us</Button>
      </div>
    </div>
  );
}
