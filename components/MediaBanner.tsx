"use client";

import { Play } from "lucide-react";
import { useRef, useState } from "react";
import { siteImages } from "@/lib/images";
import { siteMedia } from "@/lib/site-config";
import SafeImage from "./SafeImage";
import styles from "./MediaBanner.module.css";

export default function MediaBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(siteMedia.bannerVideoUrl);

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
    <section className={styles.section} aria-label="Campaign banner">
      <div className={styles.banner}>
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              className={styles.video}
              poster={siteMedia.bannerPoster || siteImages.hero}
              muted
              loop
              playsInline
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src={siteMedia.bannerVideoUrl} type="video/mp4" />
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
              src={siteMedia.bannerPoster || siteImages.hero}
              alt="Campaign banner — add your professional shoot video or poster"
              fill
              fallbackKind="editorial"
              className={styles.poster}
              sizes="100vw"
            />
          </div>
        )}
        <div className={styles.overlay}>
          <p className={styles.eyebrow}>Campaign · Studio shoot</p>
          <p className={styles.title}>Replace with your professional footage</p>
          <p className={styles.hint}>
            Set <code>NEXT_PUBLIC_BANNER_VIDEO_URL</code> for full-width video
          </p>
        </div>
      </div>
    </section>
  );
}
