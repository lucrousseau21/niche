"use client";

import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";

const CONSENT_STORAGE_KEY = "niche-cookie-consent-v1";
const OPEN_PREFERENCES_EVENT = "niche:open-cookie-preferences";
const CONSENT_CHANGED_EVENT = "niche:cookie-consent-changed";
const CONSENT_UNAVAILABLE = "__storage-unavailable__";
const CONSENT_PENDING = "__consent-pending__";

type Consent = {
  necessary: true;
  analytics: boolean;
  updatedAt: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    "ga-disable-G-MT24F9CTRC"?: boolean;
  }
}

function parseConsent(value: string | null): Consent | null {
  if (!value || value === CONSENT_UNAVAILABLE) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const consent = parsed as Partial<Consent>;
  if (consent.necessary !== true || typeof consent.analytics !== "boolean") {
    return null;
  }
  return consent as Consent;
}

function getConsentSnapshot() {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return CONSENT_UNAVAILABLE;
  }
}

function getServerConsentSnapshot() {
  return CONSENT_PENDING;
}

function subscribeToConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_CHANGED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_CHANGED_EVENT, callback);
  };
}

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className="mt-3 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))}
    >
      Gérer les cookies
    </button>
  );
}

export default function CookieConsent() {
  const consentValue = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const consent = parseConsent(consentValue);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState<boolean | null>(null);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const openPreferences = () => setPreferencesOpen(true);
    window.addEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
    return () =>
      window.removeEventListener(OPEN_PREFERENCES_EVENT, openPreferences);
  }, []);

  function saveConsent(analytics: boolean) {
    const nextConsent: Consent = {
      necessary: true,
      analytics,
      updatedAt: new Date().toISOString(),
    };

    setAnalyticsChoice(null);
    setPreferencesOpen(false);
    window["ga-disable-G-MT24F9CTRC"] = !analytics;
    window.dataLayer?.push([
      "consent",
      "update",
      {
        analytics_storage: analytics ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      },
    ]);

    try {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify(nextConsent),
      );
      window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }

  return (
    <>
      {consent?.analytics && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-MT24F9CTRC"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MT24F9CTRC');
            `}
          </Script>
        </>
      )}

      {(preferencesOpen ||
        (consentValue !== CONSENT_PENDING && !consent)) && (
        <section
          aria-label="Préférences relatives aux cookies"
          aria-describedby="cookie-consent-description"
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-gray-200 bg-white p-5 text-[#1A3D3B] shadow-2xl sm:p-6"
          role="region"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="text-lg font-bold">Vos choix de cookies</h2>
            <p id="cookie-consent-description" className="mt-2 text-sm leading-6">
              Les cookies et traceurs nécessaires au fonctionnement sont
              toujours actifs. La mesure d’audience Google est facultative et
              désactivée tant que vous ne l’avez pas autorisée. Vous pouvez
              modifier votre choix à tout moment.
              {" "}
              <a className="underline underline-offset-2" href="/conf#cookies">
                En savoir plus
              </a>
            </p>

            <label className="mt-4 flex min-h-11 items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={analyticsChoice ?? consent?.analytics ?? false}
                onChange={(event) => setAnalyticsChoice(event.target.checked)}
                className="h-5 w-5 accent-[#1A3D3B]"
              />
              Autoriser la mesure d’audience Google (facultatif)
            </label>

            {(storageError || consentValue === CONSENT_UNAVAILABLE) && (
              <p className="mt-2 text-sm text-red-700" role="alert">
                Votre choix ne peut pas être enregistré dans ce navigateur.
                Il ne sera valable que pour cette session.
              </p>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => saveConsent(false)}
                className="min-h-11 rounded-lg border border-[#1A3D3B] px-5 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Tout refuser
              </button>
              <button
                type="button"
                onClick={() =>
                  saveConsent(analyticsChoice ?? consent?.analytics ?? false)
                }
                className="min-h-11 rounded-lg border border-[#1A3D3B] px-5 py-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Enregistrer mon choix
              </button>
              <button
                type="button"
                onClick={() => saveConsent(true)}
                className="min-h-11 rounded-lg bg-[#1A3D3B] px-5 py-2 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
