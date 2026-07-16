"use client";

import { useState } from "react";
import { updatePartnerChannel } from "@/lib/actions";

type ChannelType = "webhook" | "email" | "whatsapp" | "sheet";

interface StoredChannel {
  type: ChannelType;
  config: Record<string, string>;
}

export function ChannelForm({ partnerId, channels }: { partnerId: string; channels: StoredChannel[] }) {
  const current = channels[0];
  const [type, setType] = useState<ChannelType>(current?.type ?? "webhook");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setSaved(false);
    const config: Record<string, string> = {};
    if (type === "webhook") {
      config.url = String(formData.get("url") ?? "");
      config.secret = String(formData.get("secret") ?? "");
    } else if (type === "email") {
      config.to = String(formData.get("to") ?? "");
    } else if (type === "whatsapp") {
      config.phone = String(formData.get("phone") ?? "");
    } else if (type === "sheet") {
      config.sheetId = String(formData.get("sheetId") ?? "");
    }
    await updatePartnerChannel(partnerId, { type, config });
    setSaving(false);
    setSaved(true);
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <label className="block text-sm">
        <span className="mb-1 block text-slate-600">Tipo de canal</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ChannelType)}
          className="w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="webhook">Webhook</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="sheet">Google Sheet</option>
        </select>
      </label>

      {type === "webhook" ? (
        <>
          <TextField name="url" label="URL" defaultValue={current?.config.url} placeholder="https://..." />
          <TextField name="secret" label="Secret (HMAC)" defaultValue={current?.config.secret} />
        </>
      ) : null}
      {type === "email" ? (
        <TextField name="to" label="Email destino" defaultValue={current?.config.to} placeholder="broker@ejemplo.com" />
      ) : null}
      {type === "whatsapp" ? (
        <TextField name="phone" label="Numero (E.164)" defaultValue={current?.config.phone} placeholder="+595981000000" />
      ) : null}
      {type === "sheet" ? (
        <TextField name="sheetId" label="Sheet ID" defaultValue={current?.config.sheetId} />
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar canal"}
        </button>
        {saved ? <span className="text-sm text-green-600">Guardado.</span> : null}
      </div>
    </form>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-slate-600">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
    </label>
  );
}
