import { DashboardClient } from "@/components/dashboard-client";
import { Navigation } from "@/components/navigation";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navigation />
      <DashboardClient />
    </main>
  );
}
