"use client";

import { useRef, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type PointerHandler = (event: ReactPointerEvent<HTMLElement>) => void;

type DragHandlers = {
  onPointerDown: PointerHandler;
  onPointerMove: PointerHandler;
  onPointerUp: PointerHandler;
  onPointerCancel: PointerHandler;
};

const noop = () => undefined;

export function useBottomSheetDrag(
  panelRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
): DragHandlers {
  const startYRef = useRef(0);
  const distanceRef = useRef(0);
  const activePointerRef = useRef<number | null>(null);
  const handlersRef = useRef<DragHandlers>({
    onPointerDown: noop,
    onPointerMove: noop,
    onPointerUp: noop,
    onPointerCancel: noop,
  });

  useGSAP(
    (_context, contextSafe) => {
      const reset = contextSafe(() => {
        const panel = panelRef.current;
        if (!panel) return;
        gsap.to(panel, {
          y: 0,
          duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? 0
            : 0.3,
          ease: "power3.out",
          overwrite: "auto",
          clearProps: "transform",
        });
        activePointerRef.current = null;
        distanceRef.current = 0;
      });

      const finish = contextSafe(() => {
        const panel = panelRef.current;
        if (!panel) return;

        if (distanceRef.current > 96) {
          gsap.to(panel, {
            yPercent: 105,
            duration: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? 0
              : 0.28,
            ease: "power2.in",
            overwrite: "auto",
            onComplete: onDismiss,
          });
        } else {
          reset();
        }

        activePointerRef.current = null;
        distanceRef.current = 0;
      });

      handlersRef.current = {
        onPointerDown: (event) => {
          if (!window.matchMedia("(max-width: 760px)").matches) return;
          startYRef.current = event.clientY;
          distanceRef.current = 0;
          activePointerRef.current = event.pointerId;
          event.currentTarget.setPointerCapture(event.pointerId);
        },
        onPointerMove: (event) => {
          if (activePointerRef.current !== event.pointerId) return;
          const distance = Math.max(0, event.clientY - startYRef.current);
          distanceRef.current = distance;
          if (panelRef.current) {
            gsap.set(panelRef.current, { y: distance });
          }
        },
        onPointerUp: finish,
        onPointerCancel: reset,
      };

      return () => {
        handlersRef.current = {
          onPointerDown: noop,
          onPointerMove: noop,
          onPointerUp: noop,
          onPointerCancel: noop,
        };
      };
    },
    {
      scope: panelRef,
      dependencies: [onDismiss],
      revertOnUpdate: true,
    },
  );

  return {
    onPointerDown: (event) => handlersRef.current.onPointerDown(event),
    onPointerMove: (event) => handlersRef.current.onPointerMove(event),
    onPointerUp: (event) => handlersRef.current.onPointerUp(event),
    onPointerCancel: (event) => handlersRef.current.onPointerCancel(event),
  };
}
