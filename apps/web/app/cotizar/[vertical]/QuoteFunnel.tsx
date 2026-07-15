"use client";

import { useEffect, useMemo, useState } from "react";
import type { FunnelField, VerticalConfig } from "@seguro/config";
import { captureAttribution, submitLead, submitPartialLead } from "@/lib/submit-lead";

export function QuoteFunnel({ vertical }: { vertical: VerticalConfig }) {
  const steps = useMemo(() => {
    const stepNumbers = Array.from(new Set(vertical.fields.map((f) => f.step))).sort(
      (a, b) => a - b,
    );
    return stepNumbers.map((step) => ({
      step,
      fields: vertical.fields.filter((f) => f.step === step),
    }));
  }, [vertical.fields]);

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    captureAttribution();
  }, []);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  function setAnswer(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  async function goNext() {
    if (!currentStep) return;

    // Persist a partial lead once we have a phone number, so an abandoned
    // funnel is still a remarketable contact (docs/02).
    if (answers.phone) {
      submitPartialLead({
        verticalId: vertical.id,
        step: currentStep.step,
        phone: answers.phone,
        payload: answers,
      }).catch(() => {
        // best-effort; never block the funnel on this
      });
    }

    if (isLastStep) {
      await handleSubmit();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function handleSubmit() {
    if (!consent) {
      setErrorMessage("Debes aceptar el uso de tus datos para continuar");
      return;
    }
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const { name, phone, email, city, ...rest } = answers;
      await submitLead({
        verticalId: vertical.id,
        name,
        phone: phone ?? "",
        email: email || undefined,
        city: city || undefined,
        payload: rest,
        consent: true,
      });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Ocurrio un error, intenta de nuevo");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Listo! ✅</h2>
        <p className="mt-3 text-slate-600">
          Recibimos tu cotizacion de {vertical.name.toLowerCase()}. Te vamos a contactar por
          WhatsApp en las proximas horas.
        </p>
      </div>
    );
  }

  if (!currentStep) return null;

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="mb-6 h-1.5 w-full rounded-full bg-slate-100">
        <div
          className="h-1.5 rounded-full bg-blue-600 transition-all"
          style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="space-y-5">
        {currentStep.fields.map((field) => (
          <FunnelFieldInput
            key={field.key}
            field={field}
            value={answers[field.key] ?? ""}
            onChange={(value) => setAnswer(field.key, value)}
          />
        ))}

        {isLastStep ? (
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
            />
            Acepto que mis datos sean compartidos con las aseguradoras/corredores seleccionados
            para recibir cotizaciones.
          </label>
        ) : null}

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

        <div className="flex items-center gap-3">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Atras
            </button>
          ) : null}
          <button
            type="button"
            onClick={goNext}
            disabled={status === "submitting"}
            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {status === "submitting" ? "Enviando..." : isLastStep ? "Enviar" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FunnelFieldInput({
  field,
  value,
  onChange,
}: {
  field: FunnelField;
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.type === "select") {
    return (
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">{field.label}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3"
        >
          <option value="" disabled>
            Selecciona una opcion
          </option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "radio") {
    return (
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-700">{field.label}</legend>
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 has-[:checked]:border-blue-500"
            >
              <input
                type="radio"
                name={field.key}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(e.target.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{field.label}</span>
      <input
        type={field.type === "number" ? "number" : "text"}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3"
      />
    </label>
  );
}
