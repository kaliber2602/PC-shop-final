import React from 'react';
import DataTable from 'react-data-table-component';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend);

const revenueData = [
    { id: 1, month: 'January', revenue: 5000 },
    { id: 2, month: 'February', revenue: 7000 },
    { id: 3, month: 'March', revenue: 8000 },
];

const revenueColumns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Month', selector: row => row.month, sortable: true },
    { name: 'Revenue', selector: row => `$${row.revenue}`, sortable: true },
];

const lineChartData = {
    labels: ['January', 'February', 'March'],
    datasets: [
        {
            label: 'Revenue',
            data: [5000, 7000, 8000],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
    ],
};

const pieChartData = {
    labels: ['January', 'February', 'March'],
    datasets: [
        {
            data: [5000, 7000, 8000],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
    ],
};

const barChartData = {
    labels: ['January', 'February', 'March'],
    datasets: [
        {
            label: 'Revenue',
            data: [5000, 7000, 8000],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
    ],
};

const RevenueManagement = () => {
    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Revenue Management</h2>
            <div className="row">
                {/* Card 1: Table */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Revenue Table</h5>
                        </div>
                        <div className="card-body">
                            <DataTable
                                title="Revenue"
                                columns={revenueColumns}
                                data={revenueData}
                                pagination
                                highlightOnHover
                            />
                        </div>
                    </div>
                </div>

                {/* Card 2: Line Chart */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Revenue Line Chart</h5>
                        </div>
                        <div className="card-body">
                            <Line data={lineChartData} />
                        </div>
                    </div>
                </div>

                {/* Card 3: Pie Chart */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header bg-warning text-white">
                            <h5 className="mb-0">Revenue Pie Chart</h5>
                        </div>
                        <div className="card-body">
                            <Pie data={pieChartData} />
                        </div>
                    </div>
                </div>

                {/* Card 4: Bar Chart */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header bg-danger text-white">
                            <h5 className="mb-0">Revenue Bar Chart</h5>
                        </div>
                        <div className="card-body">
                            <Bar data={barChartData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueManagement;