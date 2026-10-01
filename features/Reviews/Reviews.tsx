"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getDictionary, type Language } from "@lib/i18n";

gsap.registerPlugin(useGSAP);

const images = [
  { src: "/images/reviews/IMG_8831.PNG", width: 1080, height: 1920, crop: "188 366 576 470", align: "xMidYMid slice" },
  { src: "/images/reviews/IMG_1963.PNG", width: 940, height: 788 },
  { src: "/images/reviews/IMG_1964.PNG", width: 940, height: 788 },
  { src: "/images/reviews/IMG_1962.PNG", width: 940, height: 788 },
  { src: "/images/reviews/IMG_1965.PNG", width: 940, height: 788, fit: "contain" },
  { src: "/images/reviews/IMG_1966.PNG", width: 940, height: 788 },
  { src: "/images/reviews/IMG_1967.PNG", width: 940, height: 788 },
] as const;

export default function Reviews({ lang }: { lang: Language }) {
  const t = getDictionary(lang).reviews;
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const outgoingRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const directionRef = useRef(1);
  const gestureRef = useRef<{ id: number; x: number; y: number } | null>(null);

  useGSAP(
    () => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setOutgoing(null);
        return;
      }

      const current = activeRef.current;
      const previous = outgoingRef.current;
      if (!current || !previous) return;

      gsap.set(current, { autoAlpha: 0, x: 26 * directionRef.current });
      const timeline = gsap.timeline({
        onComplete: () => {
          setOutgoing(null);
        },
      });
      timeline
        .to(previous, { autoAlpha: 0, x: -22 * directionRef.current, duration: 0.32, ease: "power2.inOut" }, 0)
        .to(current, { autoAlpha: 1, x: 0, duration: 0.48, ease: "power2.out" }, 0.12);

      return () => timeline.kill();
    },
    { scope: sectionRef, dependencies: [index], revertOnUpdate: true },
  );

  function selectReview(nextIndex: number) {
    if (nextIndex === index) return;
    directionRef.current = nextIndex === (index - 1 + t.items.length) % t.items.length ? -1 : 1;
    setOutgoing(index);
    setIndex(nextIndex);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && !(event.target as Element).closest(".review-feature-image")) return;
    gestureRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = gestureRef.current;
    gestureRef.current = null;
    if (!start || start.id !== event.pointerId) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    selectReview((index + (dx < 0 ? 1 : -1) + t.items.length) % t.items.length);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    selectReview((index + (event.key === "ArrowRight" ? 1 : -1) + t.items.length) % t.items.length);
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
        <div className={`review-feature-image${"crop" in image ? " review-feature-crop" : ""}${"fit" in image ? " review-feature-contain" : ""}`}>
          {"crop" in image ? (
            <svg
              viewBox={image.crop}
              preserveAspectRatio={image.align}
              role="img"
              aria-label={review.imageAlt}
              focusable="false"
            >
              <image href={image.src} width={image.width} height={image.height} />
            </svg>
          ) : (
            <Image
              src={image.src}
              width={image.width}
              height={image.height}
              alt={leaving ? "" : review.imageAlt}
              sizes="(max-width: 760px) 90vw, (max-width: 1100px) 32vw, 270px"
              draggable={false}
            />
          )}
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
        </div>

        <div className="reviews-showcase">
          <p id="reviews-navigation-hint" className="review-navigation-instructions">{t.navigationHint}</p>
          <div
            className="review-card-stack"
            role="group"
            aria-label={t.carouselLabel}
            aria-describedby="reviews-navigation-hint"
            aria-live="polite"
            aria-atomic="true"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { gestureRef.current = null; }}
            onDragStart={(event) => event.preventDefault()}
          >
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
            <p className="review-swipe-hint">{t.swipeHint}</p>
            <div className="review-arrow-controls">
              <button type="button" onClick={() => selectReview((index - 1 + t.items.length) % t.items.length)} aria-label={t.previous}>
                <span aria-hidden="true">←</span>
              </button>
              <button type="button" onClick={() => selectReview((index + 1) % t.items.length)} aria-label={t.next}>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
