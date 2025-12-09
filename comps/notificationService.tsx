// comps/notificationService.ts
import { Platform, Alert, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure notifications with proper TypeScript types
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  } as Notifications.NotificationBehavior),
});

export class NotificationService {
  static async schedulePushNotification(title: string, body: string) {
    try {
      // Check if we have permission first
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      // Vibrate device
      Vibration.vibrate(100);
      
      if (finalStatus === 'granted') {
        // For iOS/Android notifications
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: true,
            badge: 1,
          },
          trigger: null, // Show immediately
        });
      } else {
        // Fallback to alert if no permission
        Alert.alert(title, body);
      }
      
    } catch (error) {
      console.log('Notification error:', error);
      // Fallback to simple alert and vibration
      Vibration.vibrate(100);
      Alert.alert(title, body);
    }
  }

  static async requestPermissions() {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.log('Permission request error:', error);
      return false;
    }
  }

  static async getPermissionStatus() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.log('Get permission error:', error);
      return 'undetermined';
    }
  }
}