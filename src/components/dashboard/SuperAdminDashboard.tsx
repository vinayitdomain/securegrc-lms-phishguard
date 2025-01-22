import React from "react";
import Chart from "react-apexcharts";
import { Card } from "@/components/ui/card";

// Define color constants
const primary = {
  300: "#9b87f5",
  500: "#7E69AB"
};

const neutral = {
  300: "#C8C8C9",
  500: "#8E9196"
};

export function SuperAdminDashboard() {
  return (
    <div id="webcrumbs"> 
      <div className="w-[1200px] bg-white rounded-lg shadow-lg min-h-[800px] flex">
        {/* Sidebar */}
        <aside className="w-[250px] bg-[#7E69AB] text-white rounded-l-lg flex flex-col p-6">
          <h2 className="text-xl font-semibold mb-6">Navigation</h2>
          <nav className="flex flex-col gap-4">
            <a href="#dashboard" className="text-white hover:text-neutral-300">Dashboard</a>
            <a href="#users" className="text-white hover:text-neutral-300">User Management</a>
            <a href="#reports" className="text-white hover:text-neutral-300">Reports</a>
            <a href="#settings" className="text-white hover:text-neutral-300">Settings</a>
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1">
          <header className="flex justify-between items-center p-6 border-b border-neutral-200">
            <h1 className="text-2xl font-semibold text-neutral-950">Admin Dashboard</h1>
            <button className="px-4 py-2 bg-[#7E69AB] text-white rounded-md text-sm">Log Out</button>
          </header>
      
          <div className="grid grid-cols-3 gap-6 p-6">
            <Card className="bg-neutral-50 p-5 shadow-sm">
              <h2 className="text-lg text-[#7E69AB] font-semibold">User Statistics</h2>
              <p className="text-sm text-neutral-500 mt-1">Overview of users across all products.</p>
              <Chart
                type="pie"
                series={[40, 30, 20, 10]}
                width="100%"
                height={200}
                options={{
                  labels: ['Active Users', 'Inactive Users', 'New Users', 'Trial Users'],
                  legend: { show: true },
                  colors: [primary[500], neutral[500], primary[300], neutral[300]],
                  dataLabels: { enabled: false },
                  chart: {
                    toolbar: {
                      show: false
                    }
                  }
                }}
              />
            </Card>
      
            <Card className="bg-neutral-50 p-5 shadow-sm">
              <h2 className="text-lg text-[#7E69AB] font-semibold">Monthly Revenue</h2>
              <p className="text-sm text-neutral-500 mt-1">Performance of your product revenue.</p>
              <Chart
                type="bar"
                series={[{ name: 'Revenue', data: [50, 70, 80, 90, 100, 110, 130] }]}
                width="100%"
                height={200}
                options={{
                  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
                  colors: [primary[500]],
                  dataLabels: { enabled: false },
                  chart: {
                    toolbar: {
                      show: false
                    }
                  }
                }}
              />
            </Card>
      
            <Card className="bg-neutral-50 p-5 shadow-sm">
              <h2 className="text-lg text-[#7E69AB] font-semibold">Product Usage</h2>
              <p className="text-sm text-neutral-500 mt-1">How your products are utilized by users.</p>
              <Chart
                type="line"
                series={[{ name: 'Usage', data: [80, 90, 85, 70, 75, 95, 100] }]}
                width="100%"
                height={200}
                options={{
                  xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
                  colors: [primary[500]],
                  dataLabels: { enabled: false },
                  chart: {
                    toolbar: {
                      show: false
                    }
                  }
                }}
              />
            </Card>
          </div>
      
          <div className="grid grid-cols-2 gap-6 p-6">
            <Card className="bg-neutral-50 p-5 shadow-sm">
              <h2 className="text-lg text-[#7E69AB] font-semibold">Recent Activities</h2>
              <ul className="mt-3 space-y-3">
                <li className="flex justify-between text-sm text-neutral-950">
                  <span>User John added a new project.</span>
                  <span className="text-neutral-500">5 mins ago</span>
                </li>
                <li className="flex justify-between text-sm text-neutral-950">
                  <span>Anna upgraded her plan to Premium.</span>
                  <span className="text-neutral-500">30 mins ago</span>
                </li>
                <li className="flex justify-between text-sm text-neutral-950">
                  <span>Server downtime resolved.</span>
                  <span className="text-neutral-500">1 hour ago</span>
                </li>
              </ul>
            </Card>
      
            <Card className="bg-neutral-50 p-5 shadow-sm">
              <h2 className="text-lg text-[#7E69AB] font-semibold">Support Tickets</h2>
              <ul className="mt-3 space-y-3">
                <li className="flex justify-between text-sm text-neutral-950">
                  <span>#120 - Unable to reset password.</span>
                  <span className="text-neutral-500">Pending</span>
                </li>
                <li className="flex justify-between text-sm text-neutral-950">
                  <span>#119 - Feature request for dashboards.</span>
                  <span className="text-neutral-500">Resolved</span>
                </li>
                <li className="flex justify-between text-sm text-neutral-950">
                  <span>#118 - Subscription payment issue.</span>
                  <span className="text-neutral-500">In Progress</span>
                </li>
              </ul>
            </Card>
          </div>
      
          <div className="p-6">
            <Card className="bg-neutral-50 p-5 shadow-sm">
              <h2 className="text-lg text-[#7E69AB] font-semibold">Licenses Status</h2>
              <p className="text-sm text-neutral-500 mt-1">Current status of customer licenses.</p>
              <table className="w-full mt-3 text-left text-sm text-neutral-950 border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="py-2 px-4">Customer</th>
                    <th className="py-2 px-4">License Type</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-100">
                    <td className="py-2 px-4">John Doe</td>
                    <td className="py-2 px-4">Premium</td>
                    <td className="py-2 px-4 text-[#7E69AB]">Active</td>
                    <td className="py-2 px-4">2023-12-31</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-2 px-4">Jane Smith</td>
                    <td className="py-2 px-4">Standard</td>
                    <td className="py-2 px-4 text-neutral-500">Expired</td>
                    <td className="py-2 px-4">2022-12-31</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Mike Brown</td>
                    <td className="py-2 px-4">Trial</td>
                    <td className="py-2 px-4 text-[#9b87f5]">Trialing</td>
                    <td className="py-2 px-4">2023-11-15</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </div> 
    </div>
  );
}