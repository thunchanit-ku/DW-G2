import DashboardLayout from '@/components/DashboardLayout';
import DashboardNavCards from '@/components/DashboardNavCards';
import ReportClient from './ReportClient';

export default function ReportPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Navigation Cards */}
        <DashboardNavCards />

        <hr className="my-6" />

        {/* Report Content */}
        <ReportClient />
      </div>
    </DashboardLayout>
  );
}