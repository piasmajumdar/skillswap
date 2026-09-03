import DashboardSidebar from "./components/DashboardSidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50">

            {/* Dashboard Sidebar */}
            <DashboardSidebar />

            {/* Dashboard Content */}
            <main className="min-h-screen md:ml-[260px]">

                {/* Space for mobile top bar */}
                <div className="h-16 md:hidden" />

                <div className="min-h-screen p-4 sm:p-6 lg:p-8">
                    {children}
                </div>

            </main>

        </div>
    );
}