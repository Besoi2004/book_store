import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import Loading from '../../components/Loading';
import getBaseURL from '../../utils/baseURL';
import { formatVND } from '../../utils/formatVND';
import RevenueChart from './RevenueChart';
import {
    FiBook, FiShoppingCart, FiUsers, FiDollarSign,
    FiClock, FiCheckCircle, FiTruck, FiPackage, FiXCircle,
    FiAlertTriangle, FiBarChart2, FiAward, FiCreditCard
} from 'react-icons/fi';

ChartJS.register(ArcElement, ChartTooltip, Legend);

const STATUS_CONFIG = {
    pending:   { label: 'Chờ xử lý',   hexColor: '#EAB308', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    confirmed: { label: 'Đã xác nhận', hexColor: '#3B82F6', bg: 'bg-blue-100',   text: 'text-blue-700'   },
    shipping:  { label: 'Đang giao',   hexColor: '#A855F7', bg: 'bg-purple-100', text: 'text-purple-700' },
    delivered: { label: 'Đã giao',     hexColor: '#22C55E', bg: 'bg-green-100',  text: 'text-green-700'  },
    cancelled: { label: 'Đã hủy',      hexColor: '#EF4444', bg: 'bg-red-100',    text: 'text-red-700'    },
};

const TIER_CONFIG = {
    bronze:  { label: 'Đồng',       color: '#F59E0B' },
    silver:  { label: 'Bạc',        color: '#94A3B8' },
    gold:    { label: 'Vàng',       color: '#EAB308' },
    diamond: { label: 'Kim Cương',  color: '#06B6D4' },
};

const DOUGHNUT_OPTS = (enabled) => ({
    responsive: true,
    maintainAspectRatio: true,
    cutout: '68%',
    plugins: {
        legend: { display: false },
        tooltip: { enabled },
    },
});

/* ──────────────────────────────────────── */

const KpiCard = ({ icon, gradFrom, gradTo, value, label, sub }) => (
    <div
        className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
    >
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">{label}</p>
                <p className="text-2xl font-extrabold leading-tight truncate">{value}</p>
                {sub && <p className="text-xs mt-2 text-white/60">{sub}</p>}
            </div>
            <div className="shrink-0 bg-white/20 backdrop-blur-sm rounded-xl p-3">{icon}</div>
        </div>
        {/* decorative ring */}
        <div className="pointer-events-none absolute -bottom-6 -right-6 w-28 h-28 rounded-full border-[6px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 rounded-full border-[6px] border-white/5" />
    </div>
);

const Card = ({ title, icon, children, className = '' }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
        {title && (
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                {icon && <span className="text-gray-400">{icon}</span>}
                <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
            </div>
        )}
        {children}
    </div>
);

const StatusRow = ({ status, count, total }) => {
    const s = STATUS_CONFIG[status];
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.hexColor }} />
            <span className="text-gray-600 flex-1 text-xs">{s.label}</span>
            <span className="font-bold text-gray-800 w-6 text-right">{count}</span>
            <span className="text-gray-400 text-xs w-9 text-right">{pct}%</span>
        </div>
    );
};

/* ──────────────────────────────────────── */

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${getBaseURL()}/api/admin`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setData(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <Loading />;

    const getStatus = (s) => data?.ordersByStatus?.find(x => x._id === s)?.count || 0;
    const fmtDate = (iso) => new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const totalOrders = data?.totalOrders || 0;
    const totalSales  = data?.totalSales  || 0;
    const avgOrder    = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
    const deliveredPct = totalOrders > 0 ? Math.round((getStatus('delivered') / totalOrders) * 100) : 0;
    const cancelledCnt = getStatus('cancelled');

    // Order-status doughnut
    const statuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    const statusCounts = statuses.map(getStatus);
    const hasOrders = statusCounts.some(c => c > 0);
    const doughnutData = {
        labels: statuses.map(s => STATUS_CONFIG[s].label),
        datasets: [{
            data: hasOrders ? statusCounts : [1],
            backgroundColor: hasOrders ? statuses.map(s => STATUS_CONFIG[s].hexColor) : ['#e5e7eb'],
            borderWidth: 3,
            borderColor: '#fff',
        }],
    };

    // Tier doughnut
    const tierOrder  = ['bronze', 'silver', 'gold', 'diamond'];
    const tierColors = tierOrder.map(t => TIER_CONFIG[t].color);
    const tierCounts = tierOrder.map(t => data?.userTierStats?.find(x => x._id === t)?.count || 0);
    const hasTiers   = tierCounts.some(c => c > 0);
    const tierDoughnutData = {
        labels: tierOrder.map(t => TIER_CONFIG[t].label),
        datasets: [{
            data: hasTiers ? tierCounts : [1],
            backgroundColor: hasTiers ? tierColors : ['#e5e7eb'],
            borderWidth: 3,
            borderColor: '#fff',
        }],
    };

    const showLowStock = (data?.lowStockBooks?.length > 0) || data?.outOfStockCount > 0;

    return (
        <div className="space-y-5 pb-8">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5">
                    <FiBarChart2 className="h-3.5 w-3.5" /> Admin Dashboard
                </span>
            </div>

            {/* Low stock banner */}
            {showLowStock && (
                <div className="flex flex-wrap gap-2 items-center bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-amber-700 text-sm">
                    <FiAlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                    {data?.outOfStockCount > 0 && <span><strong>{data.outOfStockCount}</strong> sách hết hàng.</span>}
                    {data?.lowStockBooks?.length > 0 && <span><strong>{data.lowStockBooks.length}</strong> sách sắp hết (dưới 10 cuốn):</span>}
                    {(data?.lowStockBooks || []).map(b => (
                        <span key={b._id} className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">
                            {b.title}&nbsp;({b.stock})
                        </span>
                    ))}
                </div>
            )}

            {/* KPI Row */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard
                    icon={<FiBook className="h-6 w-6" />}
                    gradFrom="#7C3AED" gradTo="#4F46E5"
                    value={data?.totalBooks ?? 0}
                    label="Tổng số sách"
                    sub={`${data?.outOfStockCount ?? 0} sách đang hết hàng`}
                />
                <KpiCard
                    icon={<FiDollarSign className="h-6 w-6" />}
                    gradFrom="#10B981" gradTo="#059669"
                    value={formatVND(totalSales)}
                    label="Tổng doanh thu"
                    sub={`TB ${formatVND(avgOrder)} / đơn`}
                />
                <KpiCard
                    icon={<FiShoppingCart className="h-6 w-6" />}
                    gradFrom="#3B82F6" gradTo="#1D4ED8"
                    value={totalOrders}
                    label="Tổng đơn hàng"
                    sub={`${deliveredPct}% giao thành công`}
                />
                <KpiCard
                    icon={<FiUsers className="h-6 w-6" />}
                    gradFrom="#F59E0B" gradTo="#D97706"
                    value={data?.totalUsers ?? 0}
                    label="Tổng người dùng"
                    sub={cancelledCnt > 0 ? `${cancelledCnt} đơn đã bị hủy` : 'Không có đơn hủy'}
                />
            </div>

            {/* Chart row: Revenue (2/3) + Order status doughnut (1/3) */}
            <div className="grid xl:grid-cols-3 gap-4">
                <Card title="Doanh thu theo tháng" icon={<FiBarChart2 className="h-4 w-4" />} className="xl:col-span-2">
                    <div className="p-5">
                        <RevenueChart monthlySales={data?.monthlySales || []} />
                    </div>
                </Card>

                <Card title="Trạng thái đơn hàng" icon={<FiShoppingCart className="h-4 w-4" />}>
                    <div className="px-6 pb-6 pt-4 flex flex-col items-center gap-4">
                        <div className="relative w-44 h-44">
                            <Doughnut data={doughnutData} options={DOUGHNUT_OPTS(hasOrders)} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-extrabold text-gray-800">{totalOrders}</span>
                                <span className="text-xs text-gray-400">tổng đơn</span>
                            </div>
                        </div>
                        <div className="w-full space-y-2.5">
                            {statuses.map(s => (
                                <StatusRow key={s} status={s} count={getStatus(s)} total={totalOrders} />
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Middle row: Top books (2/3) + Tier & Payment (1/3) */}
            <div className="grid xl:grid-cols-3 gap-4">
                <Card title="Top 5 sách bán chạy nhất" icon={<FiBook className="h-4 w-4" />} className="xl:col-span-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50/80 text-gray-400 text-xs uppercase">
                                    <th className="pl-5 pr-2 py-3 text-left font-semibold w-10">#</th>
                                    <th className="px-3 py-3 text-left font-semibold">Tên sách</th>
                                    <th className="px-3 py-3 text-right font-semibold">Đã bán</th>
                                    <th className="px-5 py-3 text-right font-semibold">Doanh thu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {(data?.topSellingBooks || []).length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center text-gray-400 text-sm">Chưa có dữ liệu bán hàng</td>
                                    </tr>
                                )}
                                {(data?.topSellingBooks || []).map((book, i) => (
                                    <tr key={book._id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="pl-5 pr-2 py-3.5">
                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                                i === 0 ? 'bg-yellow-400 text-white' :
                                                i === 1 ? 'bg-slate-300 text-white' :
                                                i === 2 ? 'bg-amber-600 text-white' :
                                                'bg-gray-100 text-gray-500'
                                            }`}>{i + 1}</span>
                                        </td>
                                        <td className="px-3 py-3.5 font-medium text-gray-800 max-w-xs">
                                            <span className="line-clamp-1">{book.title}</span>
                                        </td>
                                        <td className="px-3 py-3.5 text-right">
                                            <span className="font-bold text-blue-600">{book.totalSold}</span>
                                            <span className="text-gray-400 text-xs ml-1">cuốn</span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right font-semibold text-green-600">{formatVND(book.revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="flex flex-col gap-4">
                    {/* User tier doughnut */}
                    <Card title="Hạng thành viên" icon={<FiAward className="h-4 w-4" />} className="flex-1">
                        <div className="px-5 pb-5 pt-3">
                            <div className="flex items-center gap-4">
                                <div className="relative w-24 h-24 shrink-0">
                                    <Doughnut data={tierDoughnutData} options={DOUGHNUT_OPTS(hasTiers)} />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-sm font-bold text-gray-700">{data?.totalUsers ?? 0}</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {tierOrder.map((t, i) => {
                                        const cnt = tierCounts[i];
                                        const pct = (data?.totalUsers || 0) > 0 ? Math.round((cnt / data.totalUsers) * 100) : 0;
                                        return (
                                            <div key={t} className="flex items-center gap-2 text-xs">
                                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: TIER_CONFIG[t].color }} />
                                                <span className="text-gray-600 flex-1">{TIER_CONFIG[t].label}</span>
                                                <span className="font-bold text-gray-800">{cnt}</span>
                                                <span className="text-gray-400 w-8 text-right">{pct}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Payment method */}
                    <Card title="Phương thức thanh toán" icon={<FiCreditCard className="h-4 w-4" />}>
                        <div className="px-5 pb-5 pt-3 space-y-4">
                            {(data?.paymentMethodStats || []).length === 0 && (
                                <p className="text-center text-gray-400 text-xs py-2">Chưa có dữ liệu</p>
                            )}
                            {(data?.paymentMethodStats || []).map(m => {
                                const pct = totalOrders > 0 ? Math.round((m.count / totalOrders) * 100) : 0;
                                const isCod = m._id === 'cod';
                                return (
                                    <div key={m._id}>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="font-semibold text-gray-700">{isCod ? '💵 Tiền mặt (COD)' : '🏦 Chuyển khoản'}</span>
                                            <span className="text-gray-500">{m.count} đơn · {pct}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                                            <div className={`h-1.5 rounded-full transition-all ${isCod ? 'bg-orange-400' : 'bg-blue-400'}`}
                                                style={{ width: `${pct}%` }} />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{formatVND(m.total)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Recent orders — full width table */}
            <Card title="Đơn hàng gần đây" icon={<FiShoppingCart className="h-4 w-4" />}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-400 text-xs uppercase">
                                <th className="px-5 py-3 text-left font-semibold">Khách hàng</th>
                                <th className="px-5 py-3 text-left font-semibold hidden md:table-cell">Email</th>
                                <th className="px-5 py-3 text-left font-semibold">Ngày đặt</th>
                                <th className="px-5 py-3 text-left font-semibold hidden lg:table-cell">Thanh toán</th>
                                <th className="px-5 py-3 text-right font-semibold">Tổng tiền</th>
                                <th className="px-5 py-3 text-center font-semibold">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(data?.recentOrders || []).length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400">Chưa có đơn hàng</td>
                                </tr>
                            )}
                            {(data?.recentOrders || []).map(order => {
                                const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                                return (
                                    <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-5 py-3.5 font-medium text-gray-800">{order.name}</td>
                                        <td className="px-5 py-3.5 text-gray-400 text-xs hidden md:table-cell">{order.email}</td>
                                        <td className="px-5 py-3.5 text-gray-500 text-xs">{fmtDate(order.createdAt)}</td>
                                        <td className="px-5 py-3.5 text-gray-500 text-xs hidden lg:table-cell">
                                            {order.paymentMethod === 'cod' ? '💵 COD' : '🏦 Chuyển khoản'}
                                        </td>
                                        <td className="px-5 py-3.5 text-right font-bold text-gray-800">{formatVND(order.totalPrice)}</td>
                                        <td className="px-5 py-3.5 text-center">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;