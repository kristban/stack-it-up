import Link from "next/link";
import { adminListSupplements } from "../lib/admin/supplements";
import { adminListSubscribers } from "../lib/admin/subscribers";

export default async function AdminHomePage() {
  const [supplements, subscribers] = await Promise.all([
    adminListSupplements(),
    adminListSubscribers(),
  ]);

  return (
    <div>
      <h1
        className="text-3xl mb-8 tracking-tight"
        style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
      >
        Admin
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          href="/admin/supplements"
          className="block rounded-3xl p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
        >
          <div
            aria-hidden="true"
            className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center text-xl"
            style={{ background: "#CFE0F7" }}
          >
            🧪
          </div>
          <h2
            className="text-lg mb-1 tracking-tight"
            style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 700 }}
          >
            Supplements
          </h2>
          <p className="text-sm" style={{ color: "#6B6558" }}>
            {supplements.length} row{supplements.length !== 1 ? "s" : ""}
          </p>
        </Link>

        <Link
          href="/admin/subscribers"
          className="block rounded-3xl p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
        >
          <div
            aria-hidden="true"
            className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center text-xl"
            style={{ background: "#F4E14F" }}
          >
            ✉️
          </div>
          <h2
            className="text-lg mb-1 tracking-tight"
            style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 700 }}
          >
            Subscribers
          </h2>
          <p className="text-sm" style={{ color: "#6B6558" }}>
            {subscribers.length} row{subscribers.length !== 1 ? "s" : ""}
          </p>
        </Link>
      </div>
    </div>
  );
}
