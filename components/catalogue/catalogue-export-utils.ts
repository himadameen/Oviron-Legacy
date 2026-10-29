export async function waitForCataloguePaint(root: HTMLElement): Promise<void> {
  await document.fonts?.ready;

  const imgs = Array.from(root.querySelectorAll("img"));
  for (const img of imgs) {
    img.loading = "eager";
    img.decode?.().catch(() => undefined);
  }

  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        })
    )
  );

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export function patchFillImages(root: HTMLElement, view: Window | null): void {
  root.querySelectorAll("img").forEach((img) => {
    if (!(img instanceof HTMLImageElement)) return;
    const parent = img.parentElement;
    if (!(parent instanceof HTMLElement)) return;

    const imgStyle = view?.getComputedStyle(img);
    if (imgStyle?.position !== "absolute") return;

    const width = parent.offsetWidth;
    const height = parent.offsetHeight;
    if (width < 8 || height < 8) return;

    parent.style.overflow = "hidden";

    img.style.position = "absolute";
    img.style.left = "0";
    img.style.top = "0";
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    img.style.maxWidth = "none";
    img.style.objectFit = "cover";
    img.style.objectPosition = "center";
  });
}
