"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siteImages } from "@/lib/images";
import { mediaUrl } from "@/lib/storefront/media";
import SafeImage from "./SafeImage";
import { useStorefront } from "./StorefrontProvider";
import styles from "./MediaBanner.module.css";

export default function MediaBanner() {
  const { marketing, sources } = useStorefront();
  const banner = marketing.campaignBanner;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    console.log("[MediaBanner] marketing source:", sources.marketing);
    console.log("[MediaBanner] campaignBanner copy:", {
      eyebrow: banner?.eyebrow,
      title: banner?.title,
      hint: banner?.hint,
    });
  }, [banner?.eyebrow, banner?.title, banner?.hint, sources.marketing]);

  if (banner?.enabled === false) return null;
  const videoUrl = banner?.video?.url?.trim() ?? "";
  const posterUrl =
    mediaUrl(banner?.video?.poster) ||
    mediaUrl(banner?.fallbackImage) ||
    siteImages.hero;
  const hasVideo = Boolean(videoUrl);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      className={styles.section}
      aria-label={banner?.ariaLabel ?? "Campaign banner"}
    >
      <div className={styles.banner}>
        {hasVideo ? (
          <>
            <div
              className={`${styles.mediaMotion} ${playing ? styles.mediaMotionPaused : ""}`}
              aria-hidden
            >
              <video
                ref={videoRef}
                className={styles.video}
                poster={posterUrl}
                muted
                loop
                playsInline
                preload="metadata"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              >
                <source src={videoUrl} type={banner?.video?.mime ?? "video/mp4"} />
              </video>
            </div>
            <button
              type="button"
              className={styles.playBtn}
              onClick={togglePlay}
              aria-label={playing ? "Pause campaign video" : "Play campaign video"}
            >
              <Play size={20} fill="currentColor" aria-hidden />
              {playing ? "Pause" : "Play shoot"}
            </button>
          </>
        ) : (
          <div className={styles.posterWrap}>
            <div className={styles.mediaMotion} aria-hidden>
              <SafeImage
                src={posterUrl}
                alt={
                  banner?.fallbackImage?.alt ??
                  "Campaign banner — add your professional shoot video or poster"
                }
                fill
                fallbackKind="editorial"
                className={styles.poster}
                sizes="100vw"
              />
            </div>
          </div>
        )}
        <div className={styles.overlay}>
          {banner?.eyebrow ? (
            <p className={styles.eyebrow}>{banner.eyebrow}</p>
          ) : null}
          {banner?.title ? (
            <p className={styles.title}>{banner.title}</p>
          ) : null}
          {banner?.hint ? <p className={styles.hint}>{banner.hint}</p> : null}
        </div>
      </div>
    </section>
  );
}
