import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook để tự động đồng bộ dữ liệu user từ database
 * @param {boolean} autoSync - Tự động sync khi component mount
 * @param {number} syncInterval - Thời gian tự động refresh (ms), null để tắt
 */
export const useUserSync = (autoSync = true, syncInterval = null) => {
    const { currentUser, refreshUserData } = useAuth();

    useEffect(() => {
        // Sync once on mount if autoSync is true
        if (autoSync && currentUser) {
            refreshUserData();
        }

        // Setup interval if specified
        if (syncInterval && currentUser) {
            const interval = setInterval(() => {
                refreshUserData();
            }, syncInterval);

            return () => clearInterval(interval);
        }
    }, [currentUser?.email, autoSync, syncInterval]);

    return { currentUser, refreshUserData };
};

export default useUserSync;
