
"use client";

import { useEffect, useState } from "react";
import { getUser } from "../../../_hooks/get_user";
import { API_BASE } from "../_lib/api";

type FinancialConfig = {
  coin_type: string;
  hourly_rate: string;
  profit_margin: string;
};

export type FinancialSettings = {
  saved: boolean;
  setSaved: React.Dispatch<React.SetStateAction<boolean>>;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  formData: FinancialConfig;
  setFormData: React.Dispatch<React.SetStateAction<FinancialConfig>>;
  originalData: FinancialConfig;
  setOriginalData: React.Dispatch<React.SetStateAction<FinancialConfig>>;
  handleChange: (
    field: string,
    value: string
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};

export function useFinancialForm() {
  const user = getUser();
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState<FinancialConfig>({
    coin_type: "USD",
    hourly_rate: "",
    profit_margin: "",
  });

  const [originalData, setOriginalData] = useState<FinancialConfig>({
    coin_type: "USD",
    hourly_rate: "",
    profit_margin: "",
  });

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/finances/${user?.id}`)
    .then(async (res) => {
      if (res.status === 404) return null;

      if (!res.ok) {
        throw new Error("Error cargando configuración");
      }

      return res.json();
    })
    .then((data) => {
      if (!data) return;

      setFormData(data);
    })
    .catch(console.error);
  }, [user]);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      if (!user) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `${API_BASE}/finances/${user?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const text = await response.text();

        console.log("ERROR BACKEND:");
        console.log(text);

        throw new Error(text);
      }
      setSaved(true);
      setOriginalData(formData);
      setEditing(false);

      window.dispatchEvent(new CustomEvent("financialSettingsUpdated", { detail: formData }));

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  }

  return {
    saved,
    setSaved,
    editing,
    setEditing,
    formData,
    setFormData,
    originalData,
    setOriginalData,
    handleChange,
    handleSubmit,
  };
}
