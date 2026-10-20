import { collectionImages, siteImages } from "./images";

export type GalleryItem = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  span?: "normal" | "wide" | "tall";
};

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "Formal line",
    image: collectionImages.formal,
    imageAlt: "Gallery — formal footwear",
    span: "wide",
  },
  {
    id: "g2",
    title: "Leather texture",
    image: siteImages.texture,
    imageAlt: "Gallery — leather detail",
  },
  {
    id: "g3",
    title: "Loafer profile",
    image: collectionImages.loafers,
    imageAlt: "Gallery — loafers",
    span: "tall",
  },
  {
    id: "g4",
    title: "Casual assortment",
    image: collectionImages.casual,
    imageAlt: "Gallery — casual",
  },
  {
    id: "g5",
    title: "Sneaker styles",
    image: collectionImages.sneakers,
    imageAlt: "Gallery — sneakers",
  },
  {
    id: "g6",
    title: "Campaign hero",
    image: siteImages.hero,
    imageAlt: "Gallery — editorial",
    span: "wide",
  },
];
