/**
 * Dashboard Charts Component
 * Lazy-loaded charts to improve initial load performance
 */

import React from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);

const DashboardCharts = ({ categoryBreakdown, totalIncome, totalExpenses }) => {
  // Detect theme for chart colors
  const isDarkTheme = document.body.classList.contains('dark-theme');
  const textColor = isDarkTheme ? '#ffffff' : '#000000';
  const gridColor = isDarkTheme ? '#475569' : '#e1e8ed';
  
  // Pie Chart Data (Category Breakdown)
  const pieData = {
    labels: Object.keys(categoryBreakdown),
    datasets: [{
      data: Object.values(categoryBreakdown),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  // Bar Chart Data (Income vs Expenses)
  const barData = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      label: 'Amount (₹)',
      data: [totalIncome, totalExpenses],
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 99, 132, 0.8)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    }],
  };

  // Chart options for Pie chart
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          font: {
            size: 12,
            weight: '500'
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: isDarkTheme ? '#16213e' : '#ffffff',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1
      }
    }
  };

  // Chart options for Bar chart
  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: isDarkTheme ? '#16213e' : '#ffffff',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
          font: {
            size: 11
          }
        },
        grid: {
          color: gridColor,
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          font: {
            size: 11
          }
        },
        grid: {
          color: gridColor,
          display: true
        }
      }
    }
  };

  return (
    <div className="grid grid-2 mb-4">
      <div className="card">
        <h3 className="card-title">Category Breakdown</h3>
        <div className="chart-container">
          {Object.keys(categoryBreakdown).length > 0 ? (
            <Pie data={pieData} options={pieOptions} />
          ) : (
            <p className="text-center">No expense data available</p>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Income vs Expenses</h3>
        <div className="chart-container">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
