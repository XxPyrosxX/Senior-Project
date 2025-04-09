import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are shown when received in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions for local notifications.
export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get notification permissions!');
      return;
    }
  } else {
    alert('Must use physical device for Notifications');
  }
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-reminder', {
      name: 'Daily Reminder',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }
}

// Array of prompt messages with emojis
const reminderPrompts = [
  "Log in and check your pantry! 🔔",
  "Don't forget to log in and stay up-to-date! 💡",
  "Time to log in and check your progress! ⏰",
  "Hey, it's time to log in! 🚀",
  "Your day starts here — log in now! 🌞",
  "Log in and keep up the good work! 🎉",
  "Not eating today? 🍽️",
  "Log in and stay on track! 📈",
  "Your pantry is waiting for you! 🍏",
  "Log in and see what's new! 🆕",
  "Time to log in and get started! 🚪",
  "Log in and see what's cooking! 🍳",
];

// Define an interface for pantry items
interface PantryItem {
  id: number;
  title: string;
  quantity: string;
  expirationDate: string | null;
  image: any;
  dateAdded: string;
}

// Cancels any previously scheduled "Daily Reminder" notifications.
async function cancelExistingReminders() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.content.title === "Daily Reminder") {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

// Schedules a daily notification to fire at the next occurrence of the target time.
export async function scheduleDailyReminder() {
  await cancelExistingReminders();
  // Schedule reminder for 12:00 PM
  await scheduleNotificationForNextOccurrence(12, 0);
  // Schedule reminder for 9:00 PM
  await scheduleNotificationForNextOccurrence(21, 0);
}

async function scheduleNotificationForNextOccurrence(targetHour: number = 12, targetMinute: number = 0) {
  const now = new Date();
  let scheduledDate = new Date(now);
  scheduledDate.setHours(targetHour, targetMinute, 0, 0);

  // If today's target has passed, schedule for tomorrow.
  if (now.getTime() >= scheduledDate.getTime()) {
    scheduledDate.setDate(scheduledDate.getDate() + 1);
  }

  console.log("Now:", now);
  console.log("Scheduled date:", scheduledDate);
  const secondsUntilTrigger = Math.floor((scheduledDate.getTime() - now.getTime()) / 1000);
  console.log("Seconds until trigger:", secondsUntilTrigger);

  const randomIndex = Math.floor(Math.random() * reminderPrompts.length);
  const promptMessage = reminderPrompts[randomIndex];
  console.log(`Scheduling daily reminder at ${targetHour}:${targetMinute.toString().padStart(2, '0')} with prompt:`, promptMessage);

  // Use the date trigger
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Daily Reminder",
      body: promptMessage,
      sound: 'default',
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DATE,
      date: scheduledDate,
    },
  });

  console.log("Daily reminder scheduled to fire at:", scheduledDate);
}

// Schedules notifications for items nearing expiration
export async function scheduleExpirationNotifications(item: PantryItem): Promise<void> {
  if (!item.expirationDate) return;
  
  const expirationDate = new Date(item.expirationDate);
  const now = new Date();
  
  // Function to compare just the date portions (ignoring time)
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };
  
  // Function to check if a date is in the future (ignoring time)
  const isDateAfterToday = (date: Date): boolean => {
    const today = new Date();
    // Reset time portion for accurate date comparison
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate > today;
  };
  
  // Set all notification times to 9:00 AM for consistent delivery
  const setNotificationTime = (date: Date): Date => {
    const notificationDate = new Date(date);
    notificationDate.setHours(9, 0, 0, 0);
    return notificationDate;
  };
  
  // Cancel any existing expiration notifications for this item
  await cancelExistingItemNotifications(item.id);
  
  // Reset time portions for accurate date comparison
  const todayMidnight = new Date(now);
  todayMidnight.setHours(0, 0, 0, 0);
  
  const expirationMidnight = new Date(expirationDate);
  expirationMidnight.setHours(0, 0, 0, 0);
  
  // Check if item is already expired
  if (expirationMidnight < todayMidnight) {
    // Send immediate notification for past due item
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Item Expired!",
        body: `${item.title} has expired and should be discarded.`,
        sound: 'default',
        data: { itemId: item.id }
      },
      trigger: null // null trigger means send immediately
    });
    console.log(`Sent past due notification for ${item.title}`);
    
    // Also schedule a daily reminder until the item is removed
    // Set the reminder for tomorrow at 9:00 AM
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 1); // tomorrow
    reminderDate.setHours(9, 0, 0, 0); // 9:00 AM
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Expired Item Reminder",
        body: `Don't forget to discard ${item.title} - it has expired!`,
        sound: 'default',
        data: { itemId: item.id }
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: reminderDate
      }
    });
    console.log(`Scheduled expired item reminder for ${item.title} on ${reminderDate}`);
    
    return; // Exit early as we don't need other expiration countdown notifications
  }
  
  // Calculate dates for notifications
  const threeDaysBefore = new Date(expirationMidnight);
  threeDaysBefore.setDate(expirationMidnight.getDate() - 3);
  
  const oneDayBefore = new Date(expirationMidnight);
  oneDayBefore.setDate(expirationMidnight.getDate() - 1);
  
  // Schedule notification for 3 days before expiration if that day hasn't passed yet
  if (isDateAfterToday(threeDaysBefore) || isSameDay(threeDaysBefore, todayMidnight)) {
    const notificationTime = setNotificationTime(threeDaysBefore);
    
    if (isSameDay(threeDaysBefore, todayMidnight)) {
      // Send immediately if the expiration date is exactly 3 days from today
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Item Expiring Soon",
          body: `${item.title} will expire in 3 days!`,
          sound: 'default',
          data: { itemId: item.id }
        },
        trigger: null
      });
      console.log(`Sent immediate 3-day warning for ${item.title}`);
    } else {
      // Schedule for a future date
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Item Expiring Soon",
          body: `${item.title} will expire in 3 days!`,
          sound: 'default',
          data: { itemId: item.id }
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DATE,
          date: notificationTime
        }
      });
      console.log(`Scheduled 3-day warning for ${item.title} on ${notificationTime}`);
    }
  }
  
  // Schedule notification for 1 day before expiration if today or in future
  // This handles both tomorrow's expirations (notify today) and future expirations
  if (isDateAfterToday(oneDayBefore) || isSameDay(oneDayBefore, todayMidnight)) {
    const notificationTime = setNotificationTime(oneDayBefore);
    
    if (isSameDay(oneDayBefore, todayMidnight)) {
      // Send immediately if the 1-day warning is today
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Item Expiring Very Soon",
          body: `${item.title} will expire tomorrow!`,
          sound: 'default',
          data: { itemId: item.id }
        },
        trigger: 
          null
        
      });
      console.log(`Sent immediate 1-day warning for ${item.title}`);
    } else {
      // Schedule for future date
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Item Expiring Very Soon",
          body: `${item.title} will expire tomorrow!`,
          sound: 'default',
          data: { itemId: item.id }
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DATE,
          date: notificationTime
        }
      });
      console.log(`Scheduled 1-day warning for ${item.title} on ${notificationTime}`);
    }
  }
  
  // Schedule notification for day of expiration
  if (isDateAfterToday(expirationMidnight) || isSameDay(expirationMidnight, todayMidnight)) {
    const notificationTime = setNotificationTime(expirationMidnight);
    
    if (isSameDay(expirationMidnight, todayMidnight)) {
      // Send immediately if today is the expiration day
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Item Expiring Today",
          body: `${item.title} expires today!`,
          sound: 'default',
          data: { itemId: item.id }
        },
        trigger: 
          null
      });
      console.log(`Sent immediate expiration day notification for ${item.title}`);
    } else {
      // Schedule for future date
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Item Expiring Today",
          body: `${item.title} expires today!`,
          sound: 'default',
          data: { itemId: item.id }
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DATE,
          date: notificationTime
        }
      });
      console.log(`Scheduled expiration day notification for ${item.title} on ${notificationTime}`);
    }
  }
}

// Cancel existing notifications for a specific item
// Make this function available for external use
export async function cancelExistingItemNotifications(itemId: number): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of scheduled) {
    if (notification.content.data?.itemId === itemId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

// Dummy default export to avoid errors if this file is accidentally loaded as a screen.
export default function NotificationsPlaceholder() {
  return null;
}