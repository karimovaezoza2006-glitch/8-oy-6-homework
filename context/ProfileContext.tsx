"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  joinedAt: string;
  avatar: string | null;
};

type ProfileContextType = {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const STORAGE_KEY = "crm_profile";

  const [profile, setProfile] = useState<Profile>({
    firstName: "Olimbek",
    lastName: "Olimov",
    email: "usern88@mail.ru",
    role: "manager",
    joinedAt: "2025-06-04",
    avatar: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
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
