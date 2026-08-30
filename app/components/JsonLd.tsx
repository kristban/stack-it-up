// Renders a JSON-LD structured data block. `data` is trusted, code-generated
// output from app/lib/structuredData.ts — never pass raw user input here, as
// JSON.stringify does not escape "</script>" sequences.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
