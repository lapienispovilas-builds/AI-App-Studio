import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppData } from '@/types/app-data';

export const APP_DATA_STORAGE_KEY = 'trackglp_app_data_v1';

export async function loadAppData(): Promise<AppData | null> {
  try {
    const stored = await AsyncStorage.getItem(APP_DATA_STORAGE_KEY);
    return stored ? JSON.parse(stored) as AppData : null;
  } catch (error) {
    if (__DEV__) console.warn('TrackGLP could not load local app data.', error);
    return null;
  }
}

export async function saveAppData(data: AppData): Promise<void> {
  try {
    await AsyncStorage.setItem(APP_DATA_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    if (__DEV__) console.warn('TrackGLP could not save local app data.', error);
  }
}

export async function clearAppData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(APP_DATA_STORAGE_KEY);
  } catch (error) {
    if (__DEV__) console.warn('TrackGLP could not clear local app data.', error);
  }
}
