"use client";

import { useState, useEffect } from "react";
import { getUser } from "../../../_hooks/get_user";
import { API_BASE } from "../_lib/api";

type ProjectFormData = {
  client_mail: string;
  name: string;
  contract_type: "fixed_price" | "hourly" | "retainer";
  estimated_budget: number | null;
  deadline: Date | null;
};

const INITIAL_STATE: ProjectFormData = {
  client_mail: "",
  name: "",
  contract_type: "fixed_price",
  estimated_budget: null,
  deadline: null,
};

export function useCreateProjectForm() {
  const user = getUser();
  const [formData, setFormData] = useState<ProjectFormData>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const[clients, setClients] = useState<{ id: number; email: string; name: string }[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_BASE}/clients`); 
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar los clientes`);
        }

        const clientsData = await response.json();
        
        const finalData = Array.isArray(clientsData) ? clientsData : (clientsData.clients || []);
        setClients(finalData);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };

    fetchClients();
  }, []); 

  async function handleSubmit(e: React.FormEvent): Promise<boolean> {
    e.preventDefault();

    if (!user) {
      setError("Usuario no autenticado");
      return false;
    }

    if (!formData.client_mail || !formData.name || !formData.contract_type || !formData.estimated_budget) {
      setError("Los campos con * son obligatorios");
      return false;
    }

    setError(null);
    setLoading(true);

    try {
      const client_mail = formData.client_mail.trim().toLowerCase();
      const clientsResponse = await fetch(`${API_BASE}/clients`);
      console.log("Respuesta de /clients:", clientsResponse);
      const clientsData = await clientsResponse.json();
      
      const client = clientsData.find((c) => c.email.toLowerCase() === client_mail);

      const response = await fetch(`${API_BASE}/projects`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          client_id: client.id,
          name: formData.name,
          contract_type: formData.contract_type,
          estimated_budget: formData.estimated_budget,
          deadline: formData.deadline
            ? formData.deadline.toISOString().split("T")[0] 
            : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.detail) {

          if (Array.isArray(errorData.detail)) {
            const messages = errorData.detail.map((err: any) => {
              const field = err.loc[err.loc.length - 1];

              if (err.type === "missing") {
                return `El campo "${field}" es obligatorio`;
              }

              return err.msg.replace("Value error, ", "");
            });

            throw new Error(messages.join(". "));
          }

          if (typeof errorData.detail === "string") {
            throw new Error(errorData.detail);
          }
        }

        if (errorData.message) {
          throw new Error(errorData.message);
        }

        throw new Error("Error en el servidor");
      }
      window.dispatchEvent(new CustomEvent("projectCreated", { detail: formData }));
      setFormData(INITIAL_STATE); 
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el proyecto");
      return false;
    } finally {
      setLoading(false);
    }
    return true;
  }

  return {
    formData,
    setFormData,
    handleSubmit,
    error,
    saved,
    loading,
    clients,
  };
}