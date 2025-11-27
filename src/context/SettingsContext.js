import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {subDays, startOfDay, endOfDay} from 'date-fns';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const TIMEFRAME_OPTIONS = [
  {value: 'today', label: 'Today'},
  {value: 'yesterday', label: 'Yesterday'},
  {value: 'last7days', label: 'Last 7 Days'},
  {value: 'last30days', label: 'Last 30 Days'},
  {value: 'thisMonth', label: 'This Month'},
  {value: 'lastMonth', label: 'Last Month'},
  {value: 'custom', label: 'Custom Range'},
];

export const SettingsProvider = ({children}) => {
  const [settings, setSettings] = useState({
    defaultTimeframe: 'today',
    taxRate: 0.08,
    theme: 'light',
    notificationsEnabled: true,
    soundEnabled: true,
    defaultEventName: '',
  });

  const [reportFilter, setReportFilter] = useState({
    timeframe: 'today',
    startDate: startOfDay(new Date()),
    endDate: endOfDay(new Date()),
    eventName: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    saveSettings();
  }, [settings]);

  const loadSettings = async () => {
    try {
      const settingsData = await AsyncStorage.getItem('@app_settings');
      if (!settingsData || typeof settingsData !== 'string' || settingsData.trim() === '') {
        return; // Use default settings
      }

      let parsed;
      try {
        parsed = JSON.parse(settingsData);
      } catch (parseError) {
        console.error('Failed to parse settings, using defaults:', parseError);
        await AsyncStorage.removeItem('@app_settings').catch(() => {});
        return;
      }

      if (parsed && typeof parsed === 'object') {
        // Validate and merge with defaults
        const validatedSettings = {
          defaultTimeframe: typeof parsed.defaultTimeframe === 'string' ? parsed.defaultTimeframe : 'today',
          taxRate: typeof parsed.taxRate === 'number' && parsed.taxRate >= 0 && parsed.taxRate <= 1 ? parsed.taxRate : 0.08,
          theme: ['light', 'dark'].includes(parsed.theme) ? parsed.theme : 'light',
          notificationsEnabled: typeof parsed.notificationsEnabled === 'boolean' ? parsed.notificationsEnabled : true,
          soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
          defaultEventName: typeof parsed.defaultEventName === 'string' ? parsed.defaultEventName : '',
        };
        setSettings(validatedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Keep default settings on error
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('@app_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSetting = (key, value) => {
    try {
      if (!key || typeof key !== 'string') {
        console.error('Invalid setting key');
        return;
      }

      // Validate value based on key
      let validatedValue = value;
      switch (key) {
        case 'taxRate':
          const rate = Number(value);
          if (isNaN(rate) || rate < 0 || rate > 1) {
            console.error('Invalid tax rate');
            return;
          }
          validatedValue = rate;
          break;
        case 'theme':
          if (!['light', 'dark'].includes(value)) {
            console.error('Invalid theme');
            return;
          }
          break;
        case 'notificationsEnabled':
        case 'soundEnabled':
          if (typeof value !== 'boolean') {
            console.error('Invalid boolean setting');
            return;
          }
          break;
      }

      setSettings(prev => ({...prev, [key]: validatedValue}));
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const updateReportFilter = updates => {
    setReportFilter(prev => ({...prev, ...updates}));
  };

  const getDateRangeForTimeframe = timeframe => {
    try {
      const now = new Date();
      let start, end;

      switch (timeframe) {
        case 'today':
          start = startOfDay(now);
          end = endOfDay(now);
          break;
        case 'yesterday':
          start = startOfDay(subDays(now, 1));
          end = endOfDay(subDays(now, 1));
          break;
        case 'last7days':
          start = startOfDay(subDays(now, 7));
          end = endOfDay(now);
          break;
        case 'last30days':
          start = startOfDay(subDays(now, 30));
          end = endOfDay(now);
          break;
        case 'thisMonth':
          start = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
          end = endOfDay(now);
          break;
        case 'lastMonth':
          start = startOfDay(
            new Date(now.getFullYear(), now.getMonth() - 1, 1),
          );
          end = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));
          break;
        default:
          // Use custom dates with validation
          start = reportFilter.startDate instanceof Date ? reportFilter.startDate : startOfDay(now);
          end = reportFilter.endDate instanceof Date ? reportFilter.endDate : endOfDay(now);
      }

      // Validate dates
      if (!(start instanceof Date) || isNaN(start.getTime())) {
        start = startOfDay(now);
      }
      if (!(end instanceof Date) || isNaN(end.getTime())) {
        end = endOfDay(now);
      }

      return {start, end};
    } catch (error) {
      console.error('Error getting date range:', error);
      const now = new Date();
      return {start: startOfDay(now), end: endOfDay(now)};
    }
  };

  const value = {
    settings,
    reportFilter,
    updateSetting,
    updateReportFilter,
    getDateRangeForTimeframe,
    TIMEFRAME_OPTIONS,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
