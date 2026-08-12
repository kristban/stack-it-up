export function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  readOnly,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#8A8172" }}>
        {label}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        readOnly={readOnly}
        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[#111111]"
        style={{
          borderColor: "rgba(17,17,17,0.15)",
          background: readOnly ? "#F5F3EC" : "#FFFFFF",
          color: "#111111",
        }}
      />
    </label>
  );
}

export function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#8A8172" }}>
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[#111111]"
        style={{ borderColor: "rgba(17,17,17,0.15)", background: "#FFFFFF", color: "#111111" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="w-4 h-4"
        style={{ accentColor: "#111111" }}
      />
      <span className="text-sm font-medium" style={{ color: "#111111" }}>
        {label}
      </span>
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#8A8172" }}>
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={3}
        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[#111111] resize-y"
        style={{ borderColor: "rgba(17,17,17,0.15)", background: "#FFFFFF", color: "#111111" }}
      />
    </label>
  );
}
