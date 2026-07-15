export interface TrustBarItem {
  label: string;
}

export interface TrustBarProps {
  items: TrustBarItem[];
}

/**
 * Trust signals matter more in a low-trust market (docs/01). Keep items
 * short and concrete: regulator mention, no hidden costs, response time.
 */
export function TrustBar({ items }: TrustBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 text-green-600"
          >
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z"
              clipRule="evenodd"
            />
          </svg>
          {item.label}
        </span>
      ))}
    </div>
  );
}
