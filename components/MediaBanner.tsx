"use client";

import { Play } from "lucide-react";
import { useRef, useState } from "react";
import { siteImages } from "@/lib/images";
import { mediaUrl } from "@/lib/storefront/media";
import SafeImage from "./SafeImage";
import { useStorefront } from "./StorefrontProvider";
import styles from "./MediaBanner.module.css";

export default function MediaBanner() {
  const { marketing } = useStorefront();
  const banner = marketing.campaignBanner;
  if (banner?.enabled === false) return null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
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
