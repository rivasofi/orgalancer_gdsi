"use client";

import { useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  profession: string;
  profile_picture?: string; 
}

export function getUser() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Error al recuperar sesión", e);
      }
    }
  }, []);

  return user;
}