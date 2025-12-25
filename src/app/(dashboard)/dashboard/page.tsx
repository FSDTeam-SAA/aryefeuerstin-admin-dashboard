import { EarningsOverview } from "@/components/dashbord/earnings-overview";
import { MetricsCards } from "@/components/dashbord/metrics-cards";
import { PendingApplications } from "@/components/dashbord/pending-applications";
import { RecentBookingRequest } from "@/components/dashbord/recent-booking-request";



export default function Dashboard() {
    return (
        <div className="min-h-screen  p-6">
            <div className="container mx-auto">
                {/* Metrics Cards */}
                <MetricsCards />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    {/* Left Column - Earnings Overview */}
                    <div className="lg:col-span-2">
                        <EarningsOverview />
                    </div>

                    {/* Right Column - Pending Applications */}
                    <div>
                        <PendingApplications />
                    </div>
                </div>

                {/* Bottom Grid - Tables */}
                <div className="mt-6">
                    <RecentBookingRequest />
                </div>
            </div>
        </div>
    )
}