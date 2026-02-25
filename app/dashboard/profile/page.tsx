"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FiCamera,
  FiUser,
  FiMail,
  FiSave,
  FiLoader,
  FiCheck,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

import { useProfile } from "@/context/ProfileContext";
import { editProfile, editProfileImg } from "@/app/services/api";

export default function ProfilePage() {
  const { profile, setProfile } = useProfile();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "usern88@mail.ru",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: "usern88@mail.ru",
      });
    }
  }, [profile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Rasm 2MB dan oshmasligi kerak");
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSaveAll = async () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      toast.error("Ism va familiya kiritilishi shart");
      return;
    }

    setLoading(true);
    try {
      const textRes = await editProfile({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
      });

      let newImage = profile?.image;

      if (selectedFile) {
        const fd = new FormData();
        fd.append("image", selectedFile);
        const imgRes = await editProfileImg(fd);

        if (imgRes.status === 200 || imgRes.status === 201) {
          newImage = imgRes.data?.image;
        }
      }

      if (textRes.status === 200 || textRes.status === 201) {
        setProfile({
          ...profile,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          image: newImage,
        });

        setSaved(true);
        toast.success("Profil yangilandi");
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const displayImage = previewImage || profile?.image;

  return (
    <div className="w-full min-h-screen bg-slate-950 px-4 sm:px-6 lg:px-10 py-8">
      <Toaster position="top-center" />

      <div className="w-full max-w-5xl mx-auto">
     
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Profil sozlamalari
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Shaxsiy ma'lumotlaringizni yangilang
          </p>
        </div>

       
        <div className="bg-slate-900 border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
    
          <div className="h-28 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative" />

          <div className="px-6 sm:px-10 pb-10 -mt-16 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
       
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-slate-900 shadow-xl bg-slate-800 flex items-center justify-center">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-indigo-500">
                      {form.first_name?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg hover:bg-indigo-500 transition"
                >
                  <FiCamera />
                </button>
              </div>

          
              <div className="flex-1 mt-4 md:mt-0">
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                  {form.first_name || "Ism"} {form.last_name || "Familiya"}
                </h2>

                <div className="flex items-center gap-2 text-slate-400 mt-1 text-sm">
                  <FiMail />
                  usern88@mail.ru
                </div>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
            />

          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <InputField
                label="Ism"
                value={form.first_name}
                onChange={(v) => setForm({ ...form, first_name: v })}
              />

              <InputField
                label="Familiya"
                value={form.last_name}
                onChange={(v) => setForm({ ...form, last_name: v })}
              />

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Email (o‘zgarmaydi)
                </label>
                <div className="bg-slate-800 rounded-xl px-4 py-3 text-slate-400 text-sm">
                  usern88@mail.ru
                </div>
              </div>
            </div>

     
            <button
              onClick={handleSaveAll}
              disabled={loading}
              className={`mt-8 w-full py-4 rounded-xl font-semibold text-white transition flex items-center justify-center gap-3 ${
                saved ? "bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-500"
              } disabled:opacity-50`}
            >
              {loading ? (
                <FiLoader className="animate-spin" />
              ) : saved ? (
                <>
                  <FiCheck /> Saqlandi
                </>
              ) : (
                <>
                  <FiSave /> O‘zgarishlarni saqlash
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label} kiriting`}
        className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
      />
    </div>
  );
}
