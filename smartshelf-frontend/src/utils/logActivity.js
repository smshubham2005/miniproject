export const logActivity = (action, itemName) => {
  const logs = JSON.parse(localStorage.getItem("activityLog")) || [];

  logs.push({
    id: Date.now(),
    action,
    itemName,
    timestamp: new Date().toLocaleString(),
  });

  localStorage.setItem("activityLog", JSON.stringify(logs));
};
