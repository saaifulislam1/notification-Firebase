// /lib/pendingNotifications.ts
interface PendingNotification {
  token: string;
  title: string;
  body: string;
  sendAt: number; // timestamp in ms
}

export const pendingNotifications: PendingNotification[] = [];
