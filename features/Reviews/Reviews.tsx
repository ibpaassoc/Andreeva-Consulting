"use client";

import { useState } from "react";
import { getDictionary, type Language } from "@lib/i18n";

type Review = { name: string; specialty: string; state: string; text: string };

// Add only client-approved, permission-cleared testimonials here.
const reviews: Review[] = [];

export default function Reviews({ lang }: { lang: Language }) {
  const [index, setIndex] = useState(0);
  const t = getDictionary(lang).reviews;

  return (
    <section id="reviews" className="section reviews-section">
      <div className="page-shell">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
        {reviews.length > 0 ? (
          <div className="review-card" aria-live="polite">
            <blockquote>“{reviews[index].text}”</blockquote>
            <p>
              {reviews[index].name} · {reviews[index].specialty} ·{" "}
              {reviews[index].state}
            </p>
            <div className="review-controls">
              <button
                type="button"
                onClick={() =>
                  setIndex((index - 1 + reviews.length) % reviews.length)
                }
                aria-label={t.previous}
              >
                ←
              </button>
              <span>
                {index + 1} / {reviews.length}
              </span>
              <button
                type="button"
                onClick={() => setIndex((index + 1) % reviews.length)}
                aria-label={t.next}
              >
                →
              </button>
            </div>
          </div>
        ) : (
          <p className="review-pending">{t.pending}</p>
        )}
      </div>
    </section>
  );
}
