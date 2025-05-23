import { getApiUrl } from "@/lib/getApiUrl";
import axios from "axios";
import { GetVouchersParams, GetVouchersResponse, UpdateVoucherPayload } from "@/app/voucher/types/Voucher";

const API_URL = getApiUrl();

// 바우처 전체 조회
export async function getVouchers(params: GetVouchersParams): Promise<GetVouchersResponse> {
  try {
    const response = await axios.get(`${API_URL}/admin-api/vouchers`, {
      params,
    });

    const vouchersWithFullUrls = response.data.result.content.map((voucher: any) => ({
      ...voucher,
      imageUrl: voucher.imageUrl ? `${API_URL}/admin-api/s3/${voucher.imageUrl}` : null,
    }));

    return {
      content: vouchersWithFullUrls,
      totalPages: response.data.result.totalPages,
    };
  } catch (error) {
    console.error("바우처 조회 실패:", error);
    throw error;
  }
}

// 바우처 수정

export async function updateVoucher(voucherId: number, payload: UpdateVoucherPayload): Promise<void> {
  try {
    await axios.patch(`${API_URL}/admin-api/vouchers/${voucherId}`, payload);
  } catch (error) {
    console.error("바우처 수정 실패:", error);
    throw error;
  }
}
