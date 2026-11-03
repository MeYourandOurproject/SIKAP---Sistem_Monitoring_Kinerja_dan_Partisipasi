// utils/statusHelper.js
function getActivityStatus(activity) {
  if (activity.type === "routine" || !activity.date) {
    return "ongoing";
  }

  const todayWib = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Jakarta",
  });

  const activityDate = new Date(activity.date).toLocaleDateString("sv-SE", {
    timeZone: "Asia/Jakarta",
  });

  if (activityDate > todayWib) {
    return "planned";
  } else if (activityDate === todayWib) {
    return "ongoing";
  } else {
    return "completed";
  }
}

// Gunakan kurung kurawal { }
module.exports = { getActivityStatus };