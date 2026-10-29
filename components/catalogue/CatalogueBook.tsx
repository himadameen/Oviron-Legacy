"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { CatalogueBookPage } from "@/lib/catalog/build-catalogue-pages";
import { cataloguePagesForViewer } from "@/lib/catalog/catalogue-page-utils";
import CataloguePageContent from "./CataloguePageContent";
import styles from "./CatalogueBook.module.css";

const AUTO_MS = 6000;
const ANIM_MS = 520;
const SWIPE_MIN_PX = 36;

type CatalogueBookProps = {
  pages: CatalogueBookPage[];
};

type AnimPhase = "idle" | "leave" | "enter";

type SwipeStart = { x: number; y: number; pointerId: number };

export default function CatalogueBook({ pages }: CatalogueBookProps) {
  const viewerPages = useMemo(() => cataloguePagesForViewer(pages), [pages]);
  // const jumpTargets = useMemo(() => tocJumpTargets(pages), [pages]);

  const [pageIndex, setPageIndex] = useState(0);
  const [animPhase, setAnimPhase] = useState<AnimPhase>("idle");
  const [animDir, setAnimDir] = useState<"next" | "prev">("next");
  const [autoPlay, setAutoPlay] = useState(false);
  // const [contentsOpen, setContentsOpen] = useState(false);

  const swipeStart = useRef<SwipeStart | null>(null);
  const animLock = useRef(false);
  // const contentsWrapRef = useRef<HTMLDivElement>(null);
  // const contentsPanelRef = useRef<HTMLElement>(null);

  const pageCount = viewerPages.length;
  const currentPage = viewerPages[pageIndex] ?? viewerPages[0];

  const goToPage = useCallback(
    (nextIndex: number, direction: "next" | "prev") => {
      if (animLock.current) return;
      const clamped = Math.max(0, Math.min(pageCount - 1, nextIndex));
      if (clamped === pageIndex) return;

      animLock.current = true;
      setAnimDir(direction);
      setAnimPhase("leave");

      window.setTimeout(() => {
        setPageIndex(clamped);
        setAnimPhase("enter");
        window.setTimeout(() => {
          setAnimPhase("idle");
          animLock.current = false;
        }, ANIM_MS);
      }, ANIM_MS);
    },
    [pageCount, pageIndex]
  );

  const goNext = useCallback(() => {
    goToPage(pageIndex + 1, "next");
  }, [goToPage, pageIndex]);

  const goPrev = useCallback(() => {
    goToPage(pageIndex - 1, "prev");
  }, [goToPage, pageIndex]);

  const pageIndexRef = useRef(pageIndex);
  pageIndexRef.current = pageIndex;

  useEffect(() => {
    if (!autoPlay) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = window.setInterval(() => {
      const current = pageIndexRef.current;
      const next = current >= pageCount - 1 ? 0 : current + 1;
      goToPage(next, "next");
    }, AUTO_MS);

    return () => window.clearInterval(timer);
  }, [autoPlay, goToPage, pageCount]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // Contents panel — click-outside (re-enable with Contents button)
  // useEffect(() => {
  //   if (!contentsOpen) return;
  //   ...
  // }, [contentsOpen]);

  const finishSwipe = useCallback(
    (clientX: number, clientY: number) => {
      const start = swipeStart.current;
      swipeStart.current = null;
      if (!start) return;
      const dx = clientX - start.x;
      const dy = clientY - start.y;
      if (Math.abs(dx) < SWIPE_MIN_PX) return;
      if (Math.abs(dx) < Math.abs(dy) * 1.15) return;
      if (dx < 0) goNext();
      else goPrev();
    },
    [goNext, goPrev]
  );

  const onSwipePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button, a, input, label")) return;
    swipeStart.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onSwipePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    finishSwipe(event.clientX, event.clientY);
  };

  const onSwipePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeStart.current?.pointerId === event.pointerId) {
      swipeStart.current = null;
    }
  };

  const pageAnimClass =
    animPhase === "leave"
      ? animDir === "next"
        ? styles.pageLeaveNext
        : styles.pageLeavePrev
      : animPhase === "enter"
        ? animDir === "next"
          ? styles.pageEnterNext
          : styles.pageEnterPrev
        : "";

  return (
    <div className={styles.viewerShell} data-catalogue-viewer>
      <div className={styles.viewerTopBar}>
        <div className={styles.topBarStart}>
          {/* Contents — temporarily disabled
          <div className={styles.contentsWrap} ref={contentsWrapRef}>
            <button type="button" className={styles.contentsBtn} ...>
              Contents
            </button>
          </div>
          */}

          <button
            type="button"
            className={autoPlay ? styles.autoBtnOn : styles.autoBtn}
            onClick={() => setAutoPlay((on) => !on)}
            aria-pressed={autoPlay}
          >
            {autoPlay ? (
              <Pause size={16} strokeWidth={1.5} aria-hidden />
            ) : (
              <Play size={16} strokeWidth={1.5} aria-hidden />
            )}
            Auto {autoPlay ? "on" : "off"}
          </button>
        </div>

        <label className={styles.pageSliderLabel}>
          Page
          <input
            type="range"
            min={1}
            max={pageCount}
            value={pageIndex + 1}
            className={styles.pageSlider}
            onChange={(event) =>
              goToPage(Number(event.target.value) - 1, "next")
            }
            aria-valuetext={`Page ${pageIndex + 1} of ${pageCount}`}
          />
          <span className={styles.pageSliderValue}>
            {pageIndex + 1} / {pageCount}
          </span>
        </label>
      </div>

      {/* Contents sections panel — temporarily disabled (see Contents button) */}

      <div
        className={styles.viewerStage}
        onPointerDown={onSwipePointerDown}
        onPointerUp={onSwipePointerUp}
        onPointerCancel={onSwipePointerCancel}
      >
        <button
          type="button"
          className={styles.navBtn}
          onClick={goPrev}
          disabled={pageIndex === 0 || animPhase === "leave"}
          aria-label="Previous page"
        >
          <ChevronLeft size={28} strokeWidth={1.5} aria-hidden />
        </button>

        <div className={styles.pageViewport} data-catalogue-page-viewport>
          <div
            key={pageIndex}
            className={`${styles.pageFrame} ${pageAnimClass}`}
          >
            {currentPage ? (
              <CataloguePageContent
                page={currentPage}
                pageNumber={pageIndex + 1}
                variant="screen"
                onJumpToPage={(target) =>
                  goToPage(target, target > pageIndex ? "next" : "prev")
                }
              />
            ) : null}
          </div>
        </div>

        <button
          type="button"
          className={styles.navBtn}
          onClick={goNext}
          disabled={pageIndex >= pageCount - 1 || animPhase === "leave"}
          aria-label="Next page"
        >
          <ChevronRight size={28} strokeWidth={1.5} aria-hidden />
        </button>
      </div>

      <p className={styles.spreadMeta}>
        Full specifications on every style page · Swipe or use arrows
      </p>
    </div>
  );
}
