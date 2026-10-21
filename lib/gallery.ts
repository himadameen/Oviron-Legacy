import { collectionImages, siteImages } from "./images";

export type GalleryItem = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  span?: "normal" | "wide" | "tall" | "feature";
};

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "Formal line",
    image: collectionImages.formal,
    imageAlt: "Gallery — formal footwear",
    span: "feature",
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
    span: "wide",
  },
  {
    id: "g6",
    title: "Campaign hero",
    image: siteImages.hero,
    imageAlt: "Gallery — editorial",
  },
  {
    id: "g7",
    title: "Driving moccasin",
    image: collectionImages.driving,
    imageAlt: "Gallery — driving shoes",
  },
  {
    id: "g8",
    title: "Office derby",
    image: collectionImages.office,
    imageAlt: "Gallery — office footwear",
  },
  {
    id: "g9",
    title: "Occasion finish",
    image: collectionImages.party,
    imageAlt: "Gallery — occasion shoes",
    span: "wide",
  },
  {
    id: "g10",
    title: "Private label",
    image: siteImages.privateLabel,
    imageAlt: "Gallery — private label",
    span: "tall",
  },
  {
    id: "g11",
    title: "Custom premium",
    image: collectionImages.custom,
    imageAlt: "Gallery — custom design",
  },
  {
    id: "g12",
    title: "Studio pair",
    image: collectionImages.formal,
    imageAlt: "Gallery — studio pair",
  },
];
