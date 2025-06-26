import { Dashboard } from "@/components/Dashboard";
import { EvaluationProvider } from "@/context/EvaluationContext";

export default function Home() {
  return (
    <main className="mobile-text smooth-scroll mobile-container min-h-screen bg-background px-2 py-2 sm:px-4 sm:py-4 lg:px-6 xl:px-8">
      <Dashboard />
    </main>
  );
}
