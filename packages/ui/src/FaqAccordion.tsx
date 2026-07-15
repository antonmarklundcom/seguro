export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
}

/**
 * Renders as plain <details>/<summary> so it's fully crawlable and needs no
 * client JS — pairs with a FAQPage JSON-LD block on pillar pages (docs/03).
 */
export function FaqAccordion({ items, title = "Preguntas frecuentes" }: FaqAccordionProps) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <div className="divide-y divide-slate-200">
        {items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-900">
              {item.question}
              <span className="ml-4 text-slate-400 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
