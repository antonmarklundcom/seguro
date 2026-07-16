"use client";

import { useEffect, useState } from "react";
import { getStoredConsent, updateConsent } from "./consent";

/**
 * Minimal cookie/consent banner. Renders nothing once the user has already
 * chosen (persisted in localStorage) or during SSR.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  function accept() {
    updateConsent({ analytics: "granted", adStorage: "granted" });
    setVisible(false);
  }

  function reject() {
    updateConsent({ analytics: "denied", adStorage: "denied" });
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-slate-600">
          Usamos cookies para mejorar tu experiencia y mostrarte anuncios relevantes. Podes
          aceptar o rechazar el uso de cookies de analitica y publicidad.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
