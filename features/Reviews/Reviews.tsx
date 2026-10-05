"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { getDictionary, type Language } from "@lib/i18n";
import {
  gsap,
  motionEase,
  revealSectionLabel,
  useGSAP,
} from "@lib/motion";

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
  const dragTweenRef = useRef<gsap.core.Tween | null>(null);
  const dragTransformRef = useRef({ x: 0, rotation: 0 });

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        revealSectionLabel(".reviews-intro .eyebrow", {
          trigger: sectionRef.current,
          scope: sectionRef.current,
          start: "top 78%",
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              once: true,
            },
          })
          .fromTo(
            ".reviews-intro h2, .reviews-description",
            { x: -32, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.68,
              stagger: 0.1,
              ease: motionEase.editorial,
              clearProps: "transform,opacity,visibility",
            },
            0.12,
          )
          .fromTo(
            ".review-card-stack",
            { clipPath: "inset(0 0 0 18%)", x: 44 },
            {
              clipPath: "inset(0 0 0 0%)",
              x: 0,
              duration: 0.9,
              ease: motionEase.editorialInOut,
              clearProps: "transform,clipPath",
            },
            0.08,
          )
          .fromTo(
            ".reviews-footer",
            { y: 15, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: motionEase.gentle,
              clearProps: "transform,opacity,visibility",
            },
            0.5,
          );
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

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
      const sheet = sectionRef.current?.querySelector(
        ".review-stack-sheet-one",
      );

      dragTweenRef.current?.kill();
      gsap.set(previous, dragTransformRef.current);
      gsap.set(current, {
        autoAlpha: 0,
        x: 30 * directionRef.current,
        y: 10,
        scale: 0.94,
        rotation: 0.8 * directionRef.current,
      });
      const timeline = gsap.timeline({
        onComplete: () => {
          dragTransformRef.current = { x: 0, rotation: 0 };
          setOutgoing(null);
          if (sheet) gsap.set(sheet, { scale: 0.94 });
        },
      });
      timeline
        .to(
          previous,
          {
            autoAlpha: 0,
            x: -34 * directionRef.current,
            rotation: -1.8 * directionRef.current,
            duration: 0.34,
            ease: "power2.inOut",
          },
          0,
        )
        .to(
          sheet,
          { scale: 1, y: 0, duration: 0.48, ease: motionEase.settle },
          0,
        )
        .to(
          current,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.56,
            ease: motionEase.settle,
          },
          0.1,
        );

      return () => timeline.kill();
    },
    { scope: sectionRef, dependencies: [index], revertOnUpdate: true },
  );

  useGSAP(
    () => () => dragTweenRef.current?.kill(),
    { scope: sectionRef },
  );

  function selectReview(nextIndex: number, preserveDrag = false) {
    if (nextIndex === index) return;
    if (!preserveDrag) dragTransformRef.current = { x: 0, rotation: 0 };
    directionRef.current = nextIndex === (index - 1 + t.items.length) % t.items.length ? -1 : 1;
    setOutgoing(index);
    setIndex(nextIndex);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && !(event.target as Element).closest(".review-feature-image")) return;
    dragTweenRef.current?.kill();
    gestureRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = gestureRef.current;
    const card = activeRef.current;
    if (
      !start ||
      start.id !== event.pointerId ||
      !card ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) <= Math.abs(dy)) return;

    const travel = gsap.utils.clamp(-72, 72, dx * 0.28);
    const rotation = gsap.utils.clamp(-2.2, 2.2, dx / 54);
    const progress = gsap.utils.clamp(0, 1, Math.abs(dx) / 150);
    const sheet = sectionRef.current?.querySelector(
      ".review-stack-sheet-one",
    );

    dragTransformRef.current = { x: travel, rotation };
    gsap.set(card, dragTransformRef.current);
    if (sheet) {
      gsap.set(sheet, { scale: 0.94 + progress * 0.06, y: -progress * 4 });
    }
  }

  function settleDrag() {
    const card = activeRef.current;
    const sheet = sectionRef.current?.querySelector(
      ".review-stack-sheet-one",
    );
    if (!card) return;

    dragTransformRef.current = { x: 0, rotation: 0 };
    dragTweenRef.current?.kill();
    dragTweenRef.current = gsap.to(card, {
      x: 0,
      rotation: 0,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 0.44,
      ease: motionEase.settle,
      overwrite: "auto",
    });
    if (sheet) {
      gsap.to(sheet, {
        scale: 0.94,
        y: 0,
        duration: 0.4,
        ease: motionEase.settle,
        overwrite: "auto",
      });
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = gestureRef.current;
    gestureRef.current = null;
    if (!start || start.id !== event.pointerId) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.2) {
      settleDrag();
      return;
    }
    selectReview(
      (index + (dx < 0 ? 1 : -1) + t.items.length) % t.items.length,
      true,
    );
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
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              gestureRef.current = null;
              settleDrag();
            }}
            onDragStart={(event) => event.preventDefault()}
          >
            <span className="review-stack-sheet review-stack-sheet-one" aria-hidden="true" />
            <span className="review-stack-sheet review-stack-sheet-two" aria-hidden="true" />
            {outgoing !== null && renderCard(outgoing, true)}
            {renderCard(index)}
          </div>
          <div className="reviews-footer">
            <div className="review-progress" aria-label={t.position.replace("{current}", String(index + 1)).replace("{total}", String(t.items.length))}>
              <span>
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(t.items.length).padStart(2, "0")}
              </span>
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
