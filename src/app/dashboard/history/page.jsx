import DashboardHeader from "@/components/dashboard-header"

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Generation History</h1>

          <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-400 text-center py-8">Your thumbnail generation history will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
