import { collectionImages } from "./images";

export type CollectionGroupId = "formal" | "casual" | "sports" | "other";

export type CollectionItem = {
  id: string;
  number: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  group: CollectionGroupId;
};

export const collectionGroups: {
  id: CollectionGroupId;
  label: string;
  subtitle: string;
}[] = [
  { id: "formal", label: "Formal", subtitle: "Dress & business profiles" },
  { id: "casual", label: "Casual", subtitle: "Everyday leather lines" },
  { id: "sports", label: "Sports", subtitle: "Active & sneaker-led styles" },
  { id: "other", label: "Other", subtitle: "Occasion & custom direction" },
];

export const collections: CollectionItem[] = [
  {
    id: "oxford",
    number: "01",
    name: "Oxford Formal",
    description: "Classic closed lacing",
    image: collectionImages.formal,
    imageAlt: "Formal oxford leather shoes",
    group: "formal",
  },
  {
    id: "office",
    number: "02",
    name: "Business Derby",
    description: "Office-ready leather",
    image: collectionImages.office,
    imageAlt: "Business leather derby shoes",
    group: "formal",
  },
  {
    id: "loafers",
    number: "03",
    name: "Premium Loafers",
    description: "Slip-on refinement",
    image: collectionImages.loafers,
    imageAlt: "Premium leather loafers",
    group: "formal",
  },
  {
    id: "driving",
    number: "04",
    name: "Driving Moccasin",
    description: "Soft casual luxury",
    image: collectionImages.driving,
    imageAlt: "Leather driving moccasin",
    group: "casual",
  },
  {
    id: "casual",
    number: "05",
    name: "Casual Lace-Up",
    description: "Relaxed wholesale line",
    image: collectionImages.casual,
    imageAlt: "Casual leather lace-up",
    group: "casual",
  },
  {
    id: "boat",
    number: "06",
    name: "Deck & Resort",
    description: "Light resort profiles",
    image: collectionImages.loafers,
    imageAlt: "Casual deck style leather shoe",
    group: "casual",
  },
  {
    id: "sneakers",
    number: "07",
    name: "Leather Sneakers",
    description: "Sport-luxe hybrid",
    image: collectionImages.sneakers,
    imageAlt: "Leather fashion sneakers",
    group: "sports",
  },
  {
    id: "active",
    number: "08",
    name: "Active Leather",
    description: "Performance casual",
    image: collectionImages.sneakers,
    imageAlt: "Active leather footwear",
    group: "sports",
  },
  {
    id: "occasion",
    number: "09",
    name: "Occasion & Festival",
    description: "Event-led assortments",
    image: collectionImages.party,
    imageAlt: "Occasion footwear",
    group: "other",
  },
];
