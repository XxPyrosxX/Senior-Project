import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import * as Device from 'expo-device';
import React from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH } from '@/FirebaseConfig'; // adjust the path as necessary

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
  await scheduleNotificationForNextOccurrence();
}

async function scheduleNotificationForNextOccurrence() {
  const now = new Date();
  const targetHour = 12; 
  const targetMinute = 0; // Set the target time to 12:00 PM
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
  console.log("Scheduling daily reminder with prompt:", promptMessage);

  // Use the date trigger
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Daily Reminder",
      body: promptMessage,
      sound: 'default',
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DATE,  // Use enum instead of string literal
      date: scheduledDate,  // Your Date object here
    },
  });

  console.log("Daily reminder scheduled to fire at:", scheduledDate);
}

// Dummy default export to avoid errors if this file is accidentally loaded as a screen.
export default function NotificationsPlaceholder() {
  return null;
}