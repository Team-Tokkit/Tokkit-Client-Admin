export type StoreCategory = "FOOD" | "MEDICAL" | "SERVICE" | "TOURISM" | "LODGING" | "EDUCATION";

export interface GetStoresParams {
  sidoName?: string;
  sigunguName?: string;
  storeCategory?: StoreCategory;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface StoreListItem {
  id: number;
  storeName: string;
  roadAddress: string;
  storeCategory: StoreCategory;
}

export interface GetStoresResponse {
  content: StoreListItem[];
  totalPages: number;
  totalElements: number;
}
