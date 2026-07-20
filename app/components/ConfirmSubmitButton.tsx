"use client";

export default function ConfirmSubmitButton({
  children,
  confirmMessage,
}: {
  children: React.ReactNode;
  confirmMessage: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
      className="text-sm font-medium transition-opacity hover:opacity-70"
      style={{ color: "#B23B3B" }}
    >
      {children}
    </button>
  );
}
