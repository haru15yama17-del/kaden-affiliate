import photos from "@/data/product-photos.json";
export type ProductPhotoRecord = {src:string;caption:string;sourceUrl:string;sourceLabel:string;checkedAt:string;kind?:"product"|"model-example"|"food-example"};
export function productPhoto(slug:string): ProductPhotoRecord | undefined {
  return (photos as Record<string, ProductPhotoRecord>)[slug];
}
