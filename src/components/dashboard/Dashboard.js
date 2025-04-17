import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import Menu from "./Menu";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement, 
    PointElement, 
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const lineChartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Revenue',
                data: [20, 30, 40, 50, 60, 40, 30],  
                fill: false,
                borderColor: '#42A5F5',
                tension: 0.1,
            },
        ],
    };

    const barChartData = {
        labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
        datasets: [
            {
                label: 'Sales',
                data: [2, 3, 1, 5, 4],  
                backgroundColor: '#FF7043',
                borderColor: '#FF7043',
                borderWidth: 1,
            },
        ],
    };

    const lineChartData2 = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Profit',
                data: [10, 20, 30, 40, 50, 60, 70],  
                fill: false,
                borderColor: '#FF6347',
                tension: 0.1,
            },
        ],
    };

    const barChartData2 = {
        labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
        datasets: [
            {
                label: 'Expenses',
                data: [5, 4, 6, 3, 7],  
                backgroundColor: '#66BB6A',
                borderColor: '#66BB6A',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="dashboard-container container">
            <div className="dashboard-body row">
                <div className='col-4'>
                    <Menu />
                </div>
                <div className='col-8'>
                    <div className="dashboard-content">
                        <div className="dashboard-cards">
                            <div className="dashboard-card">
                                <h3>Revenue Chart</h3>
                                <div className="chart-container">
                                    <Line
                                        data={lineChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="dashboard-card">
                                <h3>Sales by Product</h3>
                                <div className="chart-container">
                                    <Bar
                                        data={barChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="dashboard-card">
                                <h3>Profit Chart</h3>
                                <div className="chart-container">
                                    <Line
                                        data={lineChartData2}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="dashboard-card">
                                <h3>Expenses by Category</h3>
                                <div className="chart-container">
                                    <Bar
                                        data={barChartData2}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
