"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  image?: string;
  role?: string;
}

interface ProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  updateProfileImage: (image: string) => void;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile from cookies
  useEffect(() => {
    const savedUser = Cookies.get("user");

    if (savedUser) {
      try {
        setProfileState(JSON.parse(savedUser));
      } catch (e) {
        console.error("Cookie parse error:", e);
      }
    }

    setLoading(false);
  }, []);

  // General profile update
  const setProfile = (newProfile: Profile | null) => {
    setProfileState(newProfile);

    if (newProfile) {
      Cookies.set("user", JSON.stringify(newProfile), { expires: 7 });
    } else {
      Cookies.remove("user");
    }
  };

  // 🔥 Image update function (MUHIM)
  const updateProfileImage = (image: string) => {
    setProfileState((prev) => {
      if (!prev) return prev;

      const updated = { ...prev, image };

      Cookies.set("user", JSON.stringify(updated), { expires: 7 });

      return updated;
    });
  };

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, updateProfileImage, loading }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return context;
};
