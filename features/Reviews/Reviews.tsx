"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getDictionary, type Language } from "@lib/i18n";

gsap.registerPlugin(useGSAP);

const images = [
  { src: "/images/reviews/IMG_8831.PNG", width: 1080, height: 1920, portrait: true },
  { src: "/images/reviews/IMG_1963.PNG", width: 940, height: 788, portrait: false },
  { src: "/images/reviews/IMG_1964.PNG", width: 940, height: 788, portrait: false },
  { src: "/images/reviews/IMG_1962.PNG", width: 940, height: 788, portrait: false },
] as const;

export default function Reviews({ lang }: { lang: Language }) {
  const t = getDictionary(lang).reviews;
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const outgoingRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useGSAP(
    () => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setOutgoing(null);
        setIsChanging(false);
        return;
      }

      const current = activeRef.current;
      const previous = outgoingRef.current;
      if (!current || !previous) return;

      gsap.set(current, { autoAlpha: 0, x: 26 });
      const timeline = gsap.timeline({
        onComplete: () => {
          setOutgoing(null);
          setIsChanging(false);
        },
      });
      timeline
        .to(previous, { autoAlpha: 0, x: -22, duration: 0.32, ease: "power2.inOut" }, 0)
        .to(current, { autoAlpha: 1, x: 0, duration: 0.48, ease: "power2.out" }, 0.12);

      return () => timeline.kill();
    },
    { scope: sectionRef, dependencies: [index], revertOnUpdate: true },
  );

  function selectReview(nextIndex: number) {
    if (isChanging || nextIndex === index) return;
    setOutgoing(index);
    setIndex(nextIndex);
    setIsChanging(true);
  }

  function selectFromGallery(nextIndex: number) {
    selectReview(nextIndex);
    showcaseRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }

  function renderCard(reviewIndex: number, leaving = false) {
    const review = t.items[reviewIndex];
    const image = images[reviewIndex];
    return (
      <div
        key={`${reviewIndex}-${leaving ? "outgoing" : "active"}`}
        ref={leaving ? outgoingRef : activeRef}
        className={`review-feature-card${leaving ? " review-feature-card-outgoing" : ""}`}
        aria-hidden={leaving || undefined}
      >
        <div className={`review-feature-image${image.portrait ? " review-feature-portrait" : ""}`}>
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt={leaving ? "" : review.imageAlt}
            sizes="(max-width: 760px) 90vw, (max-width: 1100px) 32vw, 270px"
            priority={reviewIndex === 0}
          />
        </div>
        <div className="review-feature-copy">
          <span className="review-stars" aria-label={t.fiveStars}>★★★★★</span>
          <span className="review-quote-mark" aria-hidden="true">“</span>
          <blockquote>{review.quote}</blockquote>
          <div className="review-attribution">
            <strong>{review.name}</strong>
            <span>{review.credential}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="reviews" ref={sectionRef} className="section reviews-section" aria-labelledby="reviews-heading">
      <div className="page-shell reviews-layout">
        <div className="reviews-intro">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="reviews-heading">{t.title}</h2>
          <p className="reviews-description">{t.description}</p>
          <div className="review-arrow-controls">
            <button type="button" onClick={() => selectReview((index - 1 + t.items.length) % t.items.length)} disabled={isChanging} aria-label={t.previous}>
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={() => selectReview((index + 1) % t.items.length)} disabled={isChanging} aria-label={t.next}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div ref={showcaseRef} className="reviews-showcase">
          <div className="review-card-stack" aria-live="polite" aria-atomic="true">
            <span className="review-stack-sheet review-stack-sheet-one" aria-hidden="true" />
            <span className="review-stack-sheet review-stack-sheet-two" aria-hidden="true" />
            {outgoing !== null && renderCard(outgoing, true)}
            {renderCard(index)}
          </div>
          <div className="reviews-footer">
            <div className="review-progress" aria-label={t.position.replace("{current}", String(index + 1)).replace("{total}", String(t.items.length))}>
              <span>{index + 1} / {t.items.length}</span>
              <span className="review-progress-track" aria-hidden="true"><span style={{ width: `${((index + 1) / t.items.length) * 100}%` }} /></span>
            </div>
            <button type="button" className="reviews-gallery-toggle" aria-expanded={showGallery} aria-controls="reviews-gallery" onClick={() => setShowGallery((open) => !open)}>
              <span>{showGallery ? t.hideAll : t.viewAll}</span>
              <span className="reviews-gallery-toggle-icon" aria-hidden="true">{showGallery ? "−" : "→"}</span>
            </button>
          </div>
        </div>
      </div>
        <div id="reviews-gallery" className="page-shell reviews-gallery" aria-label={t.galleryLabel} hidden={!showGallery}>
          {t.items.map((review, reviewIndex) => (
            <button
              key={review.name}
              type="button"
              className="reviews-gallery-item"
              aria-current={reviewIndex === index ? "true" : undefined}
              onClick={() => selectFromGallery(reviewIndex)}
              disabled={isChanging}
            >
              <span className="reviews-gallery-number">0{reviewIndex + 1}</span>
              <span className="reviews-gallery-name">{review.name}</span>
              <span className="reviews-gallery-credential">{review.credential}</span>
              <span className="reviews-gallery-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
    </section>
  );
}
