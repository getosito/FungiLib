import React, { createContext, useContext, useMemo, useState } from "react";
import { translations } from "./translations";

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem("fungilib_lang") || "en";
    });

    const value = useMemo(() => {
        const t = translations[lang] || translations.en;

        const toggleLang = () => {
            setLang((prev) => {
                const next = prev === "en" ? "es" : "en";
                localStorage.setItem("fungilib_lang", next);
                return next;
            });
        };

        return { lang, setLang, toggleLang, t };
    }, [lang]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n must be used within I18nProvider");
    return ctx;
}
