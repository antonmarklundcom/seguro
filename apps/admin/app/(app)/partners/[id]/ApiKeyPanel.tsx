"use client";

import { useState } from "react";
import { regeneratePartnerApiKey } from "@/lib/actions";

export function ApiKeyPanel({ partnerId, hasKey }: { partnerId: string; hasKey: boolean }) {
  const [newKey, setNewKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleGenerate() {
    if (
      newKey === null &&
      hasKey &&
      !confirm("Ya existe una API key para este partner. Generar una nueva invalida la anterior. Continuar?")
    ) {
      return;
    }
    setBusy(true);
    const key = await regeneratePartnerApiKey(partnerId);
    setNewKey(key);
    setBusy(false);
  }

  return (
    <div>
      <p className="mb-3 text-sm text-slate-600">
        {hasKey
          ? "Este partner tiene una API key activa para GET /v1/partner/leads y reportar resultados."
          : "Este partner todavia no tiene una API key para integrarse por su cuenta."}
      </p>
      {newKey ? (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="mb-2 text-xs font-medium text-amber-800">
            Copia esta key ahora - no se puede volver a mostrar.
          </p>
          <code className="block break-all rounded bg-white px-2 py-1.5 text-xs">{newKey}</code>
        </div>
      ) : null}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={busy}
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-60"
      >
        {busy ? "Generando..." : hasKey ? "Regenerar API key" : "Generar API key"}
      </button>
    </div>
  );
}
