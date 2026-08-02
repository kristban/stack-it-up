import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, SectionHeading } from "../components/PageCard";
import { getCurrentProfile } from "../lib/auth/dal";
import {
  updateProfileAction,
  updateEmailAction,
  updateAvatarEmojiAction,
  uploadAvatarAction,
  removeAvatarAction,
} from "../lib/actions/account";
import { signOut } from "../lib/actions/auth";
import { AVATAR_EMOJIS } from "../lib/avatarEmojis";

export const metadata: Metadata = {
  title: "Your account — StackItUp",
  robots: { index: false, follow: false },
};

// requireUser runs in the proxy + the update actions; getCurrentProfile here
// gives us the row to prefill. force-dynamic so it never prerenders.
export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-2xl border px-4 py-3 text-base transition-shadow focus:outline-none focus-visible:ring-2";
const inputStyle = { background: "#FFFFFF", borderColor: "rgba(17,17,17,0.15)", color: "#14130F" };
const labelClass = "block text-sm font-medium mb-1.5";
const labelStyle = { color: "#3A362E" };
const saveButtonClass =
  "px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2";
const saveButtonStyle = { background: "#111111", color: "#FFFFFF" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string }>;
}) {
  const { updated, error } = await searchParams;
  // The proxy already redirects logged-out users away, but guard defensively.
  const { user, profile } = await getCurrentProfile();
  if (!user) {
    // Should be unreachable via the proxy; render nothing rather than leak.
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="px-4 py-16 sm:py-24 relative overflow-hidden">
          <div
            className="absolute -top-16 -right-24 w-72 h-72 rounded-[3rem] opacity-60 pointer-events-none rotate-12"
            style={{ background: "#CFE0F7" }}
          />

          <div className="max-w-2xl mx-auto relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
              style={{ color: "#6B6558" }}
            >
              ← Back to StackItUp
            </Link>

            <div className="mb-10">
              <div
                aria-hidden="true"
                className="w-16 h-16 mb-5 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: "#CFE0F7" }}
              >
                ⚙️
              </div>
              <h1
                className="text-4xl sm:text-5xl mb-3 leading-tight tracking-tight"
                style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
              >
                Your account
              </h1>
              <p className="text-lg" style={{ color: "#6B6558" }}>
                Update your name and email address.
              </p>
            </div>

            {updated === "profile" && (
              <div
                className="mb-6 rounded-2xl px-4 py-3 text-sm"
                style={{ background: "rgba(40,140,70,0.10)", color: "#2E6B3E" }}
                role="status"
              >
                Your name has been saved.
              </div>
            )}
            {updated === "avatar" && (
              <div
                className="mb-6 rounded-2xl px-4 py-3 text-sm"
                style={{ background: "rgba(40,140,70,0.10)", color: "#2E6B3E" }}
                role="status"
              >
                Your avatar has been updated.
              </div>
            )}
            {updated === "email" && (
              <div
                className="mb-6 rounded-2xl px-4 py-3 text-sm"
                style={{ background: "rgba(40,140,70,0.10)", color: "#2E6B3E" }}
                role="status"
              >
                Check your inbox — we sent a confirmation link to finish changing your email. Your
                current email stays active until you confirm.
              </div>
            )}
            {error && (
              <div
                className="mb-6 rounded-2xl px-4 py-3 text-sm"
                style={{ background: "rgba(180,40,40,0.08)", color: "#9A2A2A" }}
                role="alert"
              >
                {error}
              </div>
            )}

            <Card>
              <SectionHeading emoji="🖼️">Avatar</SectionHeading>
              <p className="text-sm mb-5" style={{ color: "#6B6558" }}>
                Shown next to your name in the navigation bar. Pick an emoji or upload a photo.
              </p>

              <div className="flex items-center gap-4 mb-6">
                <span
                  aria-hidden="true"
                  className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{ background: "#CFE0F7" }}
                >
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt=""
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : profile?.avatar_emoji ? (
                    <span className="text-3xl">{profile.avatar_emoji}</span>
                  ) : (
                    <svg width="30" height="30" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="6.5" r="3.2" stroke="#2F5580" strokeWidth="1.6" />
                      <path
                        d="M4 16c0-3 2.7-4.8 6-4.8s6 1.8 6 4.8"
                        stroke="#2F5580"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#3A362E" }}>
                    Current avatar
                  </p>
                  <p className="text-xs" style={{ color: "#8A8172" }}>
                    {profile?.avatar_url
                      ? "Uploaded photo"
                      : profile?.avatar_emoji
                        ? "Emoji"
                        : "Default icon"}
                  </p>
                </div>
              </div>

              <p className="text-sm font-medium mb-2" style={{ color: "#3A362E" }}>
                Choose an emoji
              </p>
              <form action={updateAvatarEmojiAction} className="mb-6">
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                  {AVATAR_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="submit"
                      name="emoji"
                      value={emoji}
                      aria-label={`Use ${emoji} as your avatar`}
                      aria-pressed={profile?.avatar_emoji === emoji}
                      className="aspect-square rounded-xl text-2xl flex items-center justify-center border transition-transform hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2"
                      style={{
                        background: profile?.avatar_emoji === emoji ? "#CFE0F7" : "#FFFFFF",
                        borderColor:
                          profile?.avatar_emoji === emoji ? "#2F5580" : "rgba(17,17,17,0.15)",
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </form>

              <p className="text-sm font-medium mb-2" style={{ color: "#3A362E" }}>
                Or upload a photo
              </p>
              <form action={uploadAvatarAction} className="space-y-3">
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  required
                  className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium file:cursor-pointer hover:file:opacity-90"
                  style={{ color: "#3A362E" }}
                />
                <p className="text-xs" style={{ color: "#8A8172" }}>
                  PNG, JPEG, WebP, or GIF, up to 2 MB.
                </p>
                <button type="submit" className={saveButtonClass} style={saveButtonStyle}>
                  Upload photo
                </button>
              </form>

              {(profile?.avatar_url || profile?.avatar_emoji) && (
                <form action={removeAvatarAction} className="pt-4">
                  <button
                    type="submit"
                    className="text-sm font-medium transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 rounded-full px-2 py-1"
                    style={{ color: "#9A2A2A" }}
                  >
                    Remove avatar
                  </button>
                </form>
              )}
            </Card>

            <Card>
              <SectionHeading emoji="🧑">Name</SectionHeading>
              <form action={updateProfileAction} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className={labelClass} style={labelStyle}>
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    defaultValue={profile?.first_name ?? ""}
                    className={inputClass}
                    style={inputStyle}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass} style={labelStyle}>
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    defaultValue={profile?.last_name ?? ""}
                    className={inputClass}
                    style={inputStyle}
                    autoComplete="family-name"
                  />
                </div>
                <button type="submit" className={saveButtonClass} style={saveButtonStyle}>
                  Save name
                </button>
              </form>
            </Card>

            <Card>
              <SectionHeading emoji="✉️">Email</SectionHeading>
              <form action={updateEmailAction} className="space-y-4">
                <div>
                  <label htmlFor="email" className={labelClass} style={labelStyle}>
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email ?? ""}
                    className={inputClass}
                    style={inputStyle}
                    autoComplete="email"
                    required
                  />
                  <p className="mt-1.5 text-xs" style={{ color: "#8A8172" }}>
                    Changing this sends a confirmation link to the new address.
                  </p>
                </div>
                <button type="submit" className={saveButtonClass} style={saveButtonStyle}>
                  Update email
                </button>
              </form>
            </Card>

            <div className="pt-2">
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm font-medium transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 rounded-full px-2 py-1"
                  style={{ color: "#9A2A2A" }}
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
