export type StoreCategory = "FOOD" | "MEDICAL" | "SERVICE" | "TOURISM" | "LODGING" | "EDUCATION";

export interface Voucher {
  id: number;
  imageUrl: string | null;
  name: string;
  originalPrice: number;
  price: number;
  totalCount: number;
  remainingCount: number;
  validDate: string;
  contact: string;
  storeCategory: StoreCategory;
}

export interface VoucherSearchParams {
  category?: string;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface GetVouchersParams {
  page: number;
  size: number;
  searchKeyword?: string;
  storeCategory?: string;
  sortByValidDate?: string;
}

export interface GetVouchersResponse {
  content: Voucher[];
  totalPages: number;
}

export interface VoucherDetail {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  totalCount: number;
  remainingCount: number;
  validDate: string;
  detailDescription: string;
  refundPolicy: string;
  contact: string;
  imageUrl: string;
}


export interface UpdateVoucherPayload {
  description: string;
  detailDescription: string;
  price: number;
  contact: string;
}