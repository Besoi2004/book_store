import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MONTH_MAP = {
    '01': 'T1', '02': 'T2', '03': 'T3', '04': 'T4',
    '05': 'T5', '06': 'T6', '07': 'T7', '08': 'T8',
    '09': 'T9', '10': 'T10', '11': 'T11', '12': 'T12'
};

const RevenueChart = ({ monthlySales = [] }) => {
    const labels = monthlySales.map(m => {
        const [year, month] = m._id.split('-');
        return `${MONTH_MAP[month] || month}/${year.slice(2)}`;
    });
    const salesData = monthlySales.map(m => m.totalSales);
    const orderData = monthlySales.map(m => m.totalOrders);

    const hasData = labels.length > 0;

    const data = {
        labels: hasData ? labels : ['Chưa có dữ liệu'],
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: hasData ? salesData : [0],
                backgroundColor: 'rgba(99, 102, 241, 0.75)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
                yAxisID: 'y',
            },
            {
                label: 'Số đơn hàng',
                data: hasData ? orderData : [0],
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
                yAxisID: 'y1',
            },
        ],
    };

    const options = {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                position: 'top',
                labels: { font: { size: 12 }, padding: 16, usePointStyle: true },
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        if (ctx.datasetIndex === 0)
                            return ` ${new Intl.NumberFormat('vi-VN').format(ctx.parsed.y)}₫`;
                        return ` ${ctx.parsed.y} đơn`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                position: 'left',
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                    font: { size: 11 },
                    callback: (v) => {
                        if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
                        if (v >= 1_000)     return (v / 1_000).toFixed(0) + 'K';
                        return v;
                    },
                },
            },
            y1: {
                beginAtZero: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                ticks: { font: { size: 11 } },
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } },
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default RevenueChart;