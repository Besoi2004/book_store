// Màu solid cho các hạng thành viên
export const getRankColor = (rankName) => {
    const colors = {
        bronze: {
            bg: 'bg-amber-700',
            text: 'text-white',
            border: 'border-amber-800',
            light: 'bg-amber-50',
            lightText: 'text-amber-800'
        },
        silver: {
            bg: 'bg-gray-500',
            text: 'text-white',
            border: 'border-gray-600',
            light: 'bg-gray-50',
            lightText: 'text-gray-700'
        },
        gold: {
            bg: 'bg-yellow-500',
            text: 'text-white',
            border: 'border-yellow-600',
            light: 'bg-yellow-50',
            lightText: 'text-yellow-800'
        },
        diamond: {
            bg: 'bg-cyan-500',
            text: 'text-white',
            border: 'border-cyan-600',
            light: 'bg-cyan-50',
            lightText: 'text-cyan-800'
        }
    };

    return colors[rankName?.toLowerCase()] || colors.bronze;
};

// Progress bar color cho từng hạng
export const getRankProgressColor = (rankName) => {
    const colors = {
        bronze: 'bg-amber-700',
        silver: 'bg-gray-500',
        gold: 'bg-yellow-500',
        diamond: 'bg-cyan-500'
    };

    return colors[rankName?.toLowerCase()] || colors.bronze;
};
