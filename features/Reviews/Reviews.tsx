"use client";
import { useState } from "react";
import type { Language } from "@lib/i18n";
export type Review = { name: string; specialty: string; state: string; text: string };
// Add only client-approved, permission-cleared testimonials here.
const reviews: Record<Language, Review[]> = { ru: [], en: [] };
export default function Reviews({ lang }: { lang: Language }) {
  const [index, setIndex] = useState(0);
  const items = reviews[lang];
  return <section id="reviews" className="section reviews-section"><div className="page-shell"><p className="eyebrow">{lang === "ru" ? "Реальный опыт" : "Client stories"}</p><h2>{lang === "ru" ? "Что говорят наши клиенты" : "What our clients say"}</h2>
    {items.length ? <div className="review-card" aria-live="polite"><blockquote>“{items[index].text}”</blockquote><p>{items[index].name} · {items[index].specialty} · {items[index].state}</p><div className="review-controls"><button type="button" onClick={() => setIndex((index - 1 + items.length) % items.length)} aria-label={lang === "ru" ? "Предыдущий отзыв" : "Previous review"}>←</button><span>{index + 1} / {items.length}</span><button type="button" onClick={() => setIndex((index + 1) % items.length)} aria-label={lang === "ru" ? "Следующий отзыв" : "Next review"}>→</button></div></div> : <p className="review-pending">{lang === "ru" ? "Здесь появятся отзывы клиентов после согласования публикации." : "Client testimonials will appear here once publication is approved."}</p>}
  </div></section>;
}
