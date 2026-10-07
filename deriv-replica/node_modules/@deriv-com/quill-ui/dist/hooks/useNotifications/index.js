import { useContext as n, useEffect as s } from "react";
import { NotificationsContext as r } from "../../providers/notification/notificationsContext.js";
const c = (e) => {
  const { banners: i = [], notificationItems: o = [] } = e ?? {}, t = n(r);
  if (!t)
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  return s(() => {
    i.length && t.updateBanners(i), o.length && t.updateNotificationItems(o);
  }, []), t;
};
export {
  c as useNotifications
};
