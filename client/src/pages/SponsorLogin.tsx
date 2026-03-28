/**
 * Maham Expo — Sponsor Login
 * Nour Theme (MAHAM EXPO Luxury Design System)
 * Glassmorphism + Gold Shimmer + Quiet Luxury Animation
 * Flow: Phone → OTP → Profile → Dashboard
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

/* ── Logo URLs ── */
const LOGO_WHITE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/mahamexpo-logo-white_b6f5381f.webp";

/* ── Interest icons ── */
const INTEREST_ICONS: Record<string, string> = {
  tech: "💻",
  food: "🍽️",
  retail: "🛍️",
  health: "🏥",
  realestate: "🏗️",
  finance: "🏦",
  education: "🎓",
  media: "🎬",
  automotive: "🚗",
  other: "📌",
};

/* ── Floating gold particles ── */
function GoldParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 20 + 15;
        const opacity = Math.random() * 0.3 + 0.1;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: "-5%",
              background: `radial-gradient(circle, rgba(212,168,50,${opacity + 0.3}) 0%, rgba(212,168,50,0) 70%)`,
              animation: `floatParticle ${duration}s ${delay}s infinite linear`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Shimmer line ── */
function ShimmerLine() {
  return (
    <div className="relative w-48 h-px mx-auto my-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4a832]/40 to-transparent" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4a832]/80 to-transparent"
        style={{ animation: "shimmerSlide 3s infinite" }}
      />
    </div>
  );
}

/* ── Step indicator ── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div
            className={`
              relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
              transition-all duration-700 ease-out
              ${
                i < current
                  ? "bg-gradient-to-br from-[#d4a832] to-[#987012] text-black shadow-[0_0_20px_rgba(212,168,50,0.4)]"
                  : i === current
                  ? "bg-gradient-to-br from-[#d4a832] to-[#987012] text-black shadow-[0_0_25px_rgba(212,168,50,0.5)] scale-110"
                  : "bg-white/5 text-white/30 border border-white/10"
              }
            `}
          >
            {i < current ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
            {i === current && (
              <div
                className="absolute inset-0 rounded-full border-2 border-[#d4a832]/50"
                style={{ animation: "pulseRing 2s infinite" }}
              />
            )}
          </div>
          {i < total - 1 && (
            <div className="w-12 h-px relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10" />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#d4a832] to-[#d4a832]/50 origin-left transition-transform duration-700"
                style={{ transform: `scaleX(${i < current ? 1 : 0})` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── OTP Input ── */
function OTPInput({
  length = 6,
  value,
  onChange,
}: {
  length?: number;
  value: string;
  onChange: (val: string) => void;
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const arr = value.split("");
    arr[idx] = char;
    const next = arr.join("").slice(0, length);
    onChange(next);
    if (char && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center" dir="ltr">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`
            w-12 h-14 text-center text-xl font-bold rounded-xl
            bg-white/5 border transition-all duration-300 outline-none
            text-white placeholder-white/20
            ${
              value[i]
                ? "border-[#d4a832]/60 shadow-[0_0_15px_rgba(212,168,50,0.2)] bg-white/8"
                : "border-white/10 hover:border-white/20"
            }
            focus:border-[#d4a832] focus:shadow-[0_0_20px_rgba(212,168,50,0.3)] focus:bg-white/8
          `}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function SponsorLogin() {
  const [, navigate] = useLocation();
  const { t, language, isRTL } = useLanguage();
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [slideDir, setSlideDir] = useState<"next" | "prev">("next");
  const [visible, setVisible] = useState(true);

  /* Interest types from translation */
  const interestKeys = ["tech", "food", "retail", "health", "realestate", "finance", "education", "media", "automotive", "other"];

  /* countdown timer for OTP resend */
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  /* step transition animation */
  const goStep = useCallback(
    (next: number) => {
      setSlideDir(next > step ? "next" : "prev");
      setVisible(false);
      setTimeout(() => {
        setStep(next);
        setVisible(true);
      }, 350);
    },
    [step]
  );

  /* ── Send OTP ── */
  const handleSendOTP = async () => {
    if (phone.length < 9) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setCountdown(60);
    goStep(1);
  };

  /* ── Verify OTP ── */
  const handleVerifyOTP = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    goStep(2);
  };

  /* ── Save profile & enter platform ── */
  const handleSaveProfile = async () => {
    if (!fullName.trim() || !companyName.trim()) return;
    setLoading(true);
    const sponsorLead = {
      phone: `+966${phone}`,
      fullName: fullName.trim(),
      companyName: companyName.trim(),
      interest: interest || (language === "ar" ? "غير محدد" : "Not specified"),
      role: "sponsor_lead",
      createdAt: new Date().toISOString(),
    };
    console.log("📋 Sponsor Lead saved to CRM:", sponsorLead);
    localStorage.setItem("sponsor_session", JSON.stringify(sponsorLead));
    localStorage.setItem("sponsor_authenticated", "true");
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    navigate("/dashboard");
  };

  /* ── Resend OTP ── */
  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setCountdown(60);
    setOtp("");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Background — Nour Theme Dark Surface ── */}
      <div className="fixed inset-0 bg-[#0D0D0C]" />
      <div
        className="fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(152,112,18,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(152,112,18,0.08) 0%, transparent 50%)",
        }}
      />
      <div
        className="fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(152,112,18,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(152,112,18,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <GoldParticles />

      {/* ── Main Card ── */}
      <div
        className={`
          relative z-10 w-full max-w-md mx-4
          bg-gradient-to-b from-white/[0.06] to-white/[0.02]
          backdrop-blur-2xl
          border border-[#3F341C]/40
          rounded-3xl
          shadow-[0_0_80px_rgba(0,0,0,0.6),0_0_40px_rgba(152,112,18,0.08)]
          overflow-hidden
        `}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[#d4a832]/50 to-transparent" />

        <div className="p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={LOGO_WHITE}
              alt="Maham Expo"
              className="h-14 object-contain drop-shadow-[0_0_20px_rgba(212,168,50,0.3)]"
            />
          </div>

          {/* Title */}
          <h1 className="text-center text-xl font-bold text-white mb-1 font-display">
            {t("login.title")}
          </h1>
          <p className="text-center text-sm text-white/40 mb-2">
            {t("login.subtitle")}
          </p>

          <ShimmerLine />

          {/* Step Indicator */}
          <StepIndicator current={step} total={3} />

          {/* ── Step Content ── */}
          <div
            className={`
              transition-all duration-350 ease-out
              ${visible ? "opacity-100 translate-y-0" : `opacity-0 ${slideDir === "next" ? "translate-y-6" : "-translate-y-6"}`}
            `}
          >
            {/* ═══ STEP 0: Phone ═══ */}
            {step === 0 && (
              <div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl sovereign-glass-gold sovereign-glow-sm mb-4">
                    <svg className="w-8 h-8 text-[#d4a832]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-white">{t("login.step1Title")}</h2>
                  <p className="text-sm text-white/40 mt-1">{t("login.step1Subtitle")}</p>
                </div>

                <div className="relative mb-6" dir="ltr">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#d4a832]/50 focus-within:shadow-[0_0_20px_rgba(212,168,50,0.15)] transition-all duration-300">
                    <span className="text-white/50 text-sm font-medium flex-shrink-0">🇸🇦 +966</span>
                    <div className="w-px h-6 bg-white/10" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder={t("login.phonePlaceholder")}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                      className="flex-1 bg-transparent text-white text-lg outline-none placeholder-white/20 tracking-wider"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={phone.length < 9 || loading}
                  className={`
                    w-full py-3.5 rounded-xl text-base font-bold
                    transition-all duration-500 relative overflow-hidden
                    ${
                      phone.length >= 9 && !loading
                        ? "bg-gradient-to-r from-[#d4a832] to-[#987012] text-black shadow-[0_0_30px_rgba(212,168,50,0.3)] hover:shadow-[0_0_40px_rgba(212,168,50,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-white/5 text-white/20 cursor-not-allowed"
                    }
                  `}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>{t("common.loading")}</span>
                    </div>
                  ) : (
                    t("login.sendOtp")
                  )}
                  {phone.length >= 9 && !loading && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(212,168,67,0.15)] to-transparent"
                      style={{ animation: "shimmerSlide 3s infinite" }}
                    />
                  )}
                </button>

                <button
                  onClick={() => goStep(2)}
                  className="w-full mt-3 py-2.5 text-sm text-white/30 hover:text-white/50 transition-colors"
                >
                  {t("login.skipVerification")}
                </button>
              </div>
            )}

            {/* ═══ STEP 1: OTP ═══ */}
            {step === 1 && (
              <div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl sovereign-glass-gold sovereign-glow-sm mb-4">
                    <svg className="w-8 h-8 text-[#d4a832]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-white">{t("login.step2Title")}</h2>
                  <p className="text-sm text-white/40 mt-1">
                    {t("login.step2Subtitle")}
                  </p>
                  <p className="text-sm text-[#d4a832] font-mono mt-1 tracking-wider" dir="ltr">
                    +966 {phone}
                  </p>
                </div>

                <div className="mb-6">
                  <OTPInput value={otp} onChange={setOtp} />
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={otp.length < 6 || loading}
                  className={`
                    w-full py-3.5 rounded-xl text-base font-bold
                    transition-all duration-500 relative overflow-hidden
                    ${
                      otp.length >= 6 && !loading
                        ? "bg-gradient-to-r from-[#d4a832] to-[#987012] text-black shadow-[0_0_30px_rgba(212,168,50,0.3)] hover:shadow-[0_0_40px_rgba(212,168,50,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-white/5 text-white/20 cursor-not-allowed"
                    }
                  `}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>{t("common.loading")}</span>
                    </div>
                  ) : (
                    t("login.verifyOtp")
                  )}
                  {otp.length >= 6 && !loading && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(212,168,67,0.15)] to-transparent"
                      style={{ animation: "shimmerSlide 3s infinite" }}
                    />
                  )}
                </button>

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => goStep(0)}
                    className="text-sm text-white/30 hover:text-white/50 transition-colors flex items-center gap-1"
                  >
                    <svg className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    {t("common.back")}
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={countdown > 0}
                    className={`text-sm transition-colors ${
                      countdown > 0
                        ? "text-white/20 cursor-not-allowed"
                        : "text-[#d4a832]/70 hover:text-[#d4a832]"
                    }`}
                  >
                    {countdown > 0 ? (
                      <span>{t("login.resendIn")} ({countdown} {t("login.seconds")})</span>
                    ) : (
                      t("login.resendOtp")
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ═══ STEP 2: Profile ═══ */}
            {step === 2 && (
              <div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl sovereign-glass-gold sovereign-glow-sm mb-4">
                    <svg className="w-8 h-8 text-[#d4a832]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-white">{t("login.step3Title")}</h2>
                  <p className="text-sm text-white/40 mt-1">{t("login.step3Subtitle")}</p>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5 font-medium">
                      {t("login.fullName")} <span className="text-[#d4a832]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t("login.fullNamePlaceholder")}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#d4a832]/50 focus:shadow-[0_0_20px_rgba(212,168,50,0.15)] transition-all duration-300"
                      autoFocus
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5 font-medium">
                      {t("login.companyName")} <span className="text-[#d4a832]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t("login.companyNamePlaceholder")}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#d4a832]/50 focus:shadow-[0_0_20px_rgba(212,168,50,0.15)] transition-all duration-300"
                    />
                  </div>

                  {/* Interest Type (optional) */}
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5 font-medium">
                      {t("login.interestType")} <span className="text-white/20">({t("common.optional")})</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {interestKeys.map((key) => (
                        <button
                          key={key}
                          onClick={() => setInterest(interest === key ? "" : key)}
                          className={`
                            flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm
                            border transition-all duration-300
                            ${
                              interest === key
                                ? "bg-[#d4a832]/15 border-[#d4a832]/40 text-[#d4a832] shadow-[0_0_15px_rgba(212,168,50,0.1)]"
                                : "bg-white/[0.03] border-white/[0.06] text-white/50 hover:bg-white/[0.06] hover:border-white/10"
                            }
                          `}
                        >
                          <span className="text-base">{INTEREST_ICONS[key] || "📌"}</span>
                          <span className="truncate">{t(`login.interests.${key}`)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={!fullName.trim() || !companyName.trim() || loading}
                  className={`
                    w-full py-3.5 rounded-xl text-base font-bold
                    transition-all duration-500 relative overflow-hidden
                    ${
                      fullName.trim() && companyName.trim() && !loading
                        ? "bg-gradient-to-r from-[#d4a832] to-[#987012] text-black shadow-[0_0_30px_rgba(212,168,50,0.3)] hover:shadow-[0_0_40px_rgba(212,168,50,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-white/5 text-white/20 cursor-not-allowed"
                    }
                  `}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>{t("common.loading")}</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {t("login.enterPlatform")}
                      <svg className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                  {fullName.trim() && companyName.trim() && !loading && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(212,168,67,0.15)] to-transparent"
                      style={{ animation: "shimmerSlide 3s infinite" }}
                    />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Bottom gold line */}
          <div className="mt-8">
            <ShimmerLine />
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-white/20 mt-2">
            {t("common.companyBranch")}
          </p>
          <p className="text-center text-xs text-white/15 mt-1" dir="ltr">
            {t("common.companyNameEn")} — mahamexpo.sa
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#d4a832]/30 to-transparent" />
      </div>

      {/* ── Inline keyframes ── */}
      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? "" : "-"}${Math.random() * 100}px); opacity: 0; }
        }
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
