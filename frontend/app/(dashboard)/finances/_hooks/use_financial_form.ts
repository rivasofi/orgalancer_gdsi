
"use client";

import { useEffect, useState } from "react";
import { getUser } from "../../../_hooks/get_user";
import { API_BASE } from "../_lib/api";

type FinancialConfig = {
  coin_type: string;
  hourly_rate: number;
  profit_margin: number;
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
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};

export function useFinancialForm() {
  const user = getUser();
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState<FinancialConfig>({
    coin_type: "USD",
    hourly_rate: 0,
    profit_margin: 0,
  });

  const [originalData, setOriginalData] =
  useState<FinancialConfig>({
    coin_type: "USD",
    hourly_rate: 0,
    profit_margin: 0,
  });

  useEffect(() => {
    if (!user) return;
    console.log(formData);
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
      setOriginalData(data);
    })
    .catch(console.error);
  }, [user]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "number"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    });
  }
  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      console.log("USER EN SUBMIT:", user);
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
      setOriginalData(formData);
      setSaved(true);
      setEditing(false);

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
