import type { MDXComponents } from "mdx/types";

/**
 * Required by @next/mdx for the App Router: maps markdown output to styled
 * components so guía articles (app/guias/**\/page.mdx) inherit the site's
 * typography without every article repeating className props.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 className="mt-8 mb-4 text-3xl font-bold" {...props} />,
    h2: (props) => <h2 className="mt-8 mb-3 text-2xl font-bold" {...props} />,
    h3: (props) => <h3 className="mt-6 mb-2 text-xl font-semibold" {...props} />,
    p: (props) => <p className="mb-4 leading-relaxed text-slate-700" {...props} />,
    ul: (props) => <ul className="mb-4 list-disc space-y-1 pl-6 text-slate-700" {...props} />,
    ol: (props) => <ol className="mb-4 list-decimal space-y-1 pl-6 text-slate-700" {...props} />,
    a: (props) => <a className="text-blue-600 underline hover:text-blue-700" {...props} />,
    strong: (props) => <strong className="font-semibold text-slate-900" {...props} />,
    ...components,
  };
}
