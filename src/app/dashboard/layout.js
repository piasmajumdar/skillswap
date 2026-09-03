import DashboardSidebar from "./components/DashboardSidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-black">

            {/* Dashboard Sidebar */}
            <DashboardSidebar />

            {/* Dashboard Content */}
            <main className="min-w-0 flex-1">

                {/* Space for mobile top bar */}
                <div className="h-16 md:hidden" />

                <div className="min-h-screen p-4 sm:p-6 lg:p-8">
                    {children}
                </div>

            </main>

        </div>
    );
}