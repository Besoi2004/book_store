// Utility function to format Vietnamese Dong currency
export const formatVND = (amount) => {
    if (!amount && amount !== 0) return '0₫';
    
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Alternative compact format without currency symbol
export const formatVNDCompact = (amount) => {
    if (!amount && amount !== 0) return '0';
    
    return new Intl.NumberFormat('vi-VN').format(amount);
};
