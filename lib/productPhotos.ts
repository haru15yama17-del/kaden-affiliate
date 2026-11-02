import photos from "@/data/product-photos.json";
export type ProductPhotoRecord = {src:string;caption:string;sourceUrl:string;sourceLabel:string;checkedAt:string};
export function productPhoto(slug:string): ProductPhotoRecord | undefined {
  return (photos as Record<string, ProductPhotoRecord>)[slug];
}
