import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  initials: string;
  bio: string;
  company: string;
  location: string;
  timezone: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  postPublished: boolean;
  automationCompleted: boolean;
  teamUpdates: boolean;
  marketingEmails: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number; // minutes
  loginAlerts: boolean;
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  compactMode: boolean;
  showAnimations: boolean;
  language: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
}

interface UserPreferencesState {
  profile: UserProfile;
  notifications: NotificationPreferences;
  security: SecuritySettings;
  appearance: AppearanceSettings;
  
  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateNotifications: (updates: Partial<NotificationPreferences>) => void;
  updateSecurity: (updates: Partial<SecuritySettings>) => void;
  updateAppearance: (updates: Partial<AppearanceSettings>) => void;
  resetToDefaults: () => void;
}

const defaultProfile: UserProfile = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@company.com",
  phone: "+1 (555) 123-4567",
  role: "Administrator",
  initials: "AD",
  bio: "Social media manager with 5+ years of experience in digital marketing and content strategy.",
  company: "Acme Corp",
  location: "San Francisco, CA",
  timezone: "America/Los_Angeles",
};

const defaultNotifications: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
  postPublished: true,
  automationCompleted: true,
  teamUpdates: true,
  marketingEmails: false,
};

const defaultSecurity: SecuritySettings = {
  twoFactorEnabled: false,
  sessionTimeout: 30,
  loginAlerts: true,
};

const defaultAppearance: AppearanceSettings = {
  theme: "dark",
  compactMode: false,
  showAnimations: true,
  language: "en",
  dateFormat: "MM/dd/yyyy",
  timeFormat: "12h",
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      notifications: defaultNotifications,
      security: defaultSecurity,
      appearance: defaultAppearance,

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      updateNotifications: (updates) =>
        set((state) => ({
          notifications: { ...state.notifications, ...updates },
        })),

      updateSecurity: (updates) =>
        set((state) => ({
          security: { ...state.security, ...updates },
        })),

      updateAppearance: (updates) =>
        set((state) => ({
          appearance: { ...state.appearance, ...updates },
        })),

      resetToDefaults: () =>
        set({
          profile: defaultProfile,
          notifications: defaultNotifications,
          security: defaultSecurity,
          appearance: defaultAppearance,
        }),
    }),
    {
      name: "user-preferences-storage",
    }
  )
);
