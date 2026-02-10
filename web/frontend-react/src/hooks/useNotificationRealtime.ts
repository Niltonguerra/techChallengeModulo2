  import { useDispatch } from 'react-redux';
  import { addNotification } from '../store/notificationSlice';
  import { useEffect } from 'react';
  import { getNotificationSocket } from '../service/notification-socket';
import type { NotificationItem } from '../types/questionView';

export function useNotificationRealtime(userId?: string) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const socket = getNotificationSocket();
    socket.auth = { userId };

    if (!socket.connected) {
      socket.connect();
    }

    const onNotification = (payload: NotificationItem) => {
      dispatch(
        addNotification({
          questionId: payload.questionId,
          message: payload.message,
          createdAt: payload.createdAt ?? new Date().toISOString(),
          type: payload.type,
          questionTitle: payload.questionTitle,
        }),
      );
    };
    socket.off('notification:new', onNotification);
    socket.on('notification:new', onNotification);

    return () => {
      socket.off('notification:new', onNotification);
    };
  }, [userId, dispatch]);
}


