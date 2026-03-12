import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import Loading from '../../components/Loading';
import getBaseURL from '../../utils/baseURL';
import { formatVND } from '../../utils/formatVND';
import RevenueChart from './RevenueChart';
import { useFetchAllBooksQuery, useFetchSoldStatsQuery } from '../../redux/features/books/booksApi';
import { getImgUrl } from '../../utils/getImgUrl';
import { getCategoryLabel } from '../../utils/categories.jsx';
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
                {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
                {typeof title === 'string'
                    ? <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
                    : <div className="flex-1 font-semibold text-gray-700 text-sm">{title}</div>
                }
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
    const [chartMode, setChartMode] = useState('monthly');
    const [soldSearch, setSoldSearch] = useState('');
    const [soldSort, setSoldSort] = useState({ key: 'sold', dir: 'desc' });
    const [soldPage, setSoldPage] = useState(1);
    const SOLD_PER_PAGE = 10;

    const { data: allBooks = [] } = useFetchAllBooksQuery();
    const { data: soldStats = {} } = useFetchSoldStatsQuery();

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

    const catStats = useMemo(() => {
        const map = {};
        (allBooks || []).forEach(b => {
            const cat = b.category || 'other';
            if (!map[cat]) map[cat] = { label: getCategoryLabel(cat), sold: 0, revenue: 0, count: 0 };
            const s = soldStats[b._id] || 0;
            map[cat].sold += s;
            map[cat].revenue += s * (b.newPrice || 0);
            map[cat].count += 1;
        });
        return Object.values(map).sort((a, b) => b.revenue - a.revenue);
    }, [allBooks, soldStats]);

    const handleSoldSort = (key) => {
        setSoldSort(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
        setSoldPage(1);
    };

    const soldRows = useMemo(() => {
        let rows = (allBooks || []).map(b => ({
            ...b,
            sold: soldStats[b._id] || 0,
            revenue: (soldStats[b._id] || 0) * (b.newPrice || 0),
        }));
        if (soldSearch.trim()) {
            const q = soldSearch.toLowerCase();
            rows = rows.filter(b =>
                b.title?.toLowerCase().includes(q) ||
                b.author?.toLowerCase().includes(q)
            );
        }
        rows.sort((a, b) => {
            const av = a[soldSort.key];
            const bv = b[soldSort.key];
            if (typeof av === 'string') return soldSort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
            return soldSort.dir === 'asc' ? (av || 0) - (bv || 0) : (bv || 0) - (av || 0);
        });
        return rows;
    }, [allBooks, soldStats, soldSearch, soldSort]);

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
                <Card
                    title={
                        <div className="flex items-center justify-between w-full">
                            <span>{chartMode === 'monthly' ? 'Doanh thu theo tháng' : 'Doanh thu theo ngày (30 ngày qua)'}</span>
                            <div className="flex gap-1 ml-3">
                                <button
                                    onClick={() => setChartMode('monthly')}
                                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        chartMode === 'monthly'
                                            ? 'bg-purple-600 text-white shadow'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >Theo tháng</button>
                                <button
                                    onClick={() => setChartMode('daily')}
                                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        chartMode === 'daily'
                                            ? 'bg-purple-600 text-white shadow'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >Theo ngày</button>
                            </div>
                        </div>
                    }
                    icon={<FiBarChart2 className="h-4 w-4" />}
                    className="xl:col-span-2"
                >
                    <div className="p-5">
                        <RevenueChart
                            monthlySales={data?.monthlySales || []}
                            dailySales={data?.dailySales || []}
                            mode={chartMode}
                        />
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

            {/* Middle row: Category stats (2/3) + Tier & Payment (1/3) */}
            <div className="grid xl:grid-cols-3 gap-4">
                <Card title="Doanh thu theo danh mục" icon={<FiBook className="h-4 w-4" />} className="xl:col-span-2">
                    {catStats.length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-10">Chưa có dữ liệu</p>
                    )}
                    {catStats.length > 0 && (() => {
                        const maxRevenue = catStats[0]?.revenue || 1;
                        const totalSoldAll = catStats.reduce((s, c) => s + c.sold, 0);
                        const BAR_COLORS = [
                            'from-purple-500 to-indigo-400',
                            'from-blue-500 to-cyan-400',
                            'from-emerald-500 to-teal-400',
                            'from-amber-500 to-yellow-400',
                            'from-rose-500 to-pink-400',
                            'from-orange-500 to-amber-400',
                            'from-sky-500 to-blue-400',
                            'from-violet-500 to-purple-400',
                        ];
                        return (
                            <div className="px-6 pt-2 pb-5">
                                {/* Summary pills */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 rounded-lg px-3 py-1">
                                        <FiBook className="h-3.5 w-3.5" />
                                        {catStats.length} danh mục
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-3 py-1">
                                        <FiShoppingCart className="h-3.5 w-3.5" />
                                        {totalSoldAll} cuốn đã bán
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg px-3 py-1">
                                        <FiDollarSign className="h-3.5 w-3.5" />
                                        {formatVND(catStats.reduce((s, c) => s + c.revenue, 0))} tổng
                                    </span>
                                </div>

                                {/* Bars */}
                                <div className="space-y-4">
                                    {catStats.map((cat, idx) => {
                                        const pct = Math.max(4, Math.round((cat.revenue / maxRevenue) * 100));
                                        const color = BAR_COLORS[idx % BAR_COLORS.length];
                                        return (
                                            <div key={cat.label}>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className={`shrink-0 inline-block w-2.5 h-2.5 rounded-sm bg-gradient-to-br ${color}`} />
                                                        <span className="text-sm font-semibold text-gray-700 truncate">{cat.label}</span>
                                                        <span className="text-xs text-gray-400 shrink-0">{cat.count} đầu sách</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 shrink-0 ml-4">
                                                        <span className="text-xs text-blue-600 font-bold">{cat.sold} cuốn</span>
                                                        <span className="text-xs text-green-600 font-semibold w-28 text-right">{formatVND(cat.revenue)}</span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                                    <div
                                                        className={`h-2.5 rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
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

            {/* All books sold stats */}
            {(() => {
                const totalPages = Math.max(1, Math.ceil(soldRows.length / SOLD_PER_PAGE));
                const pageRows = soldRows.slice((soldPage - 1) * SOLD_PER_PAGE, soldPage * SOLD_PER_PAGE);
                const SortTh = ({ label, sortKey, className = '' }) => {
                    const active = soldSort.key === sortKey;
                    return (
                        <th
                            onClick={() => handleSoldSort(sortKey)}
                            className={`px-3 py-3 font-semibold cursor-pointer select-none hover:text-purple-600 transition-colors ${className}`}
                        >
                            <span className="inline-flex items-center gap-1">
                                {label}
                                <span className={`text-xs ${active ? 'text-purple-500' : 'text-gray-300'}`}>
                                    {active ? (soldSort.dir === 'asc' ? '▲' : '▼') : '⇅'}
                                </span>
                            </span>
                        </th>
                    );
                };
                return (
                    <Card title="Thống kê bán theo đầu sách" icon={<FiBook className="h-4 w-4" />}>
                        {/* Toolbar */}
                        <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-3">
                            <input
                                type="text"
                                placeholder="Tìm theo tên sách hoặc tác giả..."
                                value={soldSearch}
                                onChange={e => { setSoldSearch(e.target.value); setSoldPage(1); }}
                                className="flex-1 min-w-[200px] max-w-sm text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-purple-200"
                            />
                            <span className="text-xs text-gray-400 shrink-0">{soldRows.length} sách</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50/80 text-gray-400 text-xs uppercase">
                                        <th className="pl-5 pr-2 py-3 text-left font-semibold w-10">#</th>
                                        <th className="px-3 py-3 text-left font-semibold">Ảnh</th>
                                        <SortTh label="Tên sách" sortKey="title" className="text-left" />
                                        <SortTh label="Tác giả" sortKey="author" className="text-left hidden md:table-cell" />
                                        <SortTh label="Giá bán" sortKey="newPrice" className="text-right" />
                                        <SortTh label="Đã bán" sortKey="sold" className="text-right" />
                                        <SortTh label="Doanh thu" sortKey="revenue" className="text-right" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pageRows.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-10 text-center text-gray-400">Không có dữ liệu</td>
                                        </tr>
                                    )}
                                    {pageRows.map((book, i) => (
                                        <tr key={book._id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="pl-5 pr-2 py-3 text-xs text-gray-400">
                                                {(soldPage - 1) * SOLD_PER_PAGE + i + 1}
                                            </td>
                                            <td className="px-3 py-2">
                                                <img src={getImgUrl(book.coverImage)} alt={book.title}
                                                    className="h-12 w-9 object-cover rounded shadow-sm" />
                                            </td>
                                            <td className="px-3 py-3 font-medium text-gray-800 max-w-xs">
                                                <span className="line-clamp-2">{book.title}</span>
                                            </td>
                                            <td className="px-3 py-3 text-gray-500 text-xs hidden md:table-cell">{book.author || '—'}</td>
                                            <td className="px-3 py-3 text-right text-xs text-purple-600 font-semibold">{formatVND(book.newPrice)}</td>
                                            <td className="px-3 py-3 text-right">
                                                <span className="font-bold text-blue-600">{book.sold}</span>
                                                <span className="text-gray-400 text-xs ml-1">cuốn</span>
                                            </td>
                                            <td className="px-3 py-3 text-right font-semibold text-green-600 text-xs">
                                                {formatVND(book.revenue)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                                <span className="text-xs text-gray-400">
                                    Trang {soldPage} / {totalPages}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setSoldPage(1)}
                                        disabled={soldPage === 1}
                                        className="px-2 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                                    >«</button>
                                    <button
                                        onClick={() => setSoldPage(p => Math.max(1, p - 1))}
                                        disabled={soldPage === 1}
                                        className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                                    >‹</button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === totalPages || Math.abs(p - soldPage) <= 1)
                                        .reduce((acc, p, idx, arr) => {
                                            if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                            acc.push(p);
                                            return acc;
                                        }, [])
                                        .map((p, idx) =>
                                            p === '...' ? (
                                                <span key={`e${idx}`} className="px-1 text-xs text-gray-400">…</span>
                                            ) : (
                                                <button
                                                    key={p}
                                                    onClick={() => setSoldPage(p)}
                                                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                                                        p === soldPage
                                                            ? 'bg-purple-600 text-white border-purple-600'
                                                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                                    }`}
                                                >{p}</button>
                                            )
                                        )
                                    }
                                    <button
                                        onClick={() => setSoldPage(p => Math.min(totalPages, p + 1))}
                                        disabled={soldPage === totalPages}
                                        className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                                    >›</button>
                                    <button
                                        onClick={() => setSoldPage(totalPages)}
                                        disabled={soldPage === totalPages}
                                        className="px-2 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                                    >»</button>
                                </div>
                            </div>
                        )}
                    </Card>
                );
            })()}

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