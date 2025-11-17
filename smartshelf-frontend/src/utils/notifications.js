/**
 * Notifications Utility
 * Handles expiry date calculations and notifications for items
 */

/**
 * Calculate days until expiry
 * @param {string} expiryDate - Date string in format YYYY-MM-DD
 * @returns {number} Days until expiry (negative if expired)
 */
export const daysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const timeDiff = expiry - today;
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * Check if item is expired
 * @param {string} expiryDate - Date string
 * @returns {boolean} True if expired
 */
export const isExpired = (expiryDate) => {
  return daysUntilExpiry(expiryDate) < 0;
};

/**
 * Check if item is expiring soon (within 3 days)
 * @param {string} expiryDate - Date string
 * @returns {boolean} True if expiring within 3 days
 */
export const isExpiringWithin3Days = (expiryDate) => {
  const days = daysUntilExpiry(expiryDate);
  return days >= 0 && days <= 3;
};

/**
 * Check if item is expiring today
 * @param {string} expiryDate - Date string
 * @returns {boolean} True if expiring today
 */
export const isExpiringToday = (expiryDate) => {
  return daysUntilExpiry(expiryDate) === 0;
};

/**
 * Get expiry status with message and color
 * @param {string} expiryDate - Date string
 * @returns {object} Status object with message, color, priority
 */
export const getExpiryStatus = (expiryDate) => {
  const days = daysUntilExpiry(expiryDate);
  
  if (days === null) {
    return { status: "no-date", message: "No expiry date", color: "gray", priority: 0 };
  }
  
  if (days < 0) {
    return { status: "expired", message: "⚠️ EXPIRED", color: "red", priority: 3 };
  }
  
  if (days === 0) {
    return { status: "expiring-today", message: "🔴 EXPIRING TODAY", color: "red", priority: 3 };
  }
  
  if (days === 1) {
    return { status: "expiring-tomorrow", message: "🟠 EXPIRING TOMORROW", color: "orange", priority: 2 };
  }
  
  if (days <= 3) {
    return { status: "expiring-soon", message: `⚠️ EXPIRES IN ${days} DAYS`, color: "yellow", priority: 2 };
  }
  
  return { status: "good", message: `✅ Expires in ${days} days`, color: "green", priority: 0 };
};

/**
 * Get all items with expiry notifications
 * @param {array} items - Array of items
 * @returns {object} Object with categorized items
 */
export const getExpiryNotifications = (items) => {
  if (!Array.isArray(items)) return { expired: [], expiringToday: [], expiringWithin3Days: [] };
  
  const notifications = {
    expired: [],
    expiringToday: [],
    expiringWithin3Days: [],
    expiringWithin7Days: [],
    good: []
  };
  
  items.forEach((item) => {
    const days = daysUntilExpiry(item.expiry);
    
    if (days === null) {
      notifications.good.push(item);
    } else if (days < 0) {
      notifications.expired.push(item);
    } else if (days === 0) {
      notifications.expiringToday.push(item);
    } else if (days <= 3) {
      notifications.expiringWithin3Days.push(item);
    } else if (days <= 7) {
      notifications.expiringWithin7Days.push(item);
    } else {
      notifications.good.push(item);
    }
  });
  
  return notifications;
};

/**
 * Format expiry date with days remaining
 * @param {string} expiryDate - Date string
 * @returns {string} Formatted message
 */
export const formatExpiryWithDays = (expiryDate) => {
  const days = daysUntilExpiry(expiryDate);
  
  if (days === null) return expiryDate || "N/A";
  if (days < 0) return `${expiryDate} (${Math.abs(days)} days ago)`;
  if (days === 0) return `${expiryDate} (TODAY)`;
  if (days === 1) return `${expiryDate} (Tomorrow)`;
  return `${expiryDate} (${days} days)`;
};

/**
 * Get high-priority notifications (expired + expiring soon)
 * @param {array} items - Array of items
 * @returns {array} High priority items
 */
export const getHighPriorityNotifications = (items) => {
  const notifications = getExpiryNotifications(items);
  return [
    ...notifications.expired,
    ...notifications.expiringToday,
    ...notifications.expiringWithin3Days
  ];
};
