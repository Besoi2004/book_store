import React, { createContext, useContext, useState } from 'react';
import TierUpgradeNotification from '../components/TierUpgradeNotification';

const TierNotificationContext = createContext();

export const useTierNotification = () => {
    const context = useContext(TierNotificationContext);
    if (!context) {
        throw new Error('useTierNotification must be used within TierNotificationProvider');
    }
    return context;
};

export const TierNotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        show: false,
        tier: 'silver'
    });

    const showTierUpgrade = (tier) => {
        setNotification({
            show: true,
            tier
        });
    };

    const hideNotification = () => {
        setNotification({
            show: false,
            tier: notification.tier
        });
    };

    return (
        <TierNotificationContext.Provider value={{ showTierUpgrade }}>
            {children}
            <TierUpgradeNotification
                show={notification.show}
                tier={notification.tier}
                onClose={hideNotification}
            />
        </TierNotificationContext.Provider>
    );
};
