import apiClient from "@/lib/apiClient";
import {
  GetVouchersParams,
  GetVouchersResponse,
  UpdateVoucherPayload,
  VoucherDetail,
  VoucherCreateParams,
} from "@/app/voucher/types/Voucher";
import { GetStoresParams, GetStoresResponse } from "@/app/voucher/types/Store";

// 바우처 전체 조회
export async function getVouchers(
  params: GetVouchersParams
): Promise<GetVouchersResponse> {
  try {
    const response = await apiClient.get(`/admin-api/vouchers`, {
      params,
    });

    const vouchersWithFullUrls = response.data.result.content.map(
      (voucher: any) => ({
        ...voucher,
        imageUrl: voucher.imageUrl
          ? `/admin-api/s3/${voucher.imageUrl}`
          : null,
      })
    );

    return {
      content: vouchersWithFullUrls,
      totalPages: response.data.result.totalPages,
    };
  } catch (error) {
    console.error("바우처 조회 실패:", error);
    throw error;
  }
}

// 바우처 상세 조회
export async function getVoucherDetail(
  voucherId: number
): Promise<VoucherDetail> {
  try {
    const response = await apiClient.get(
      `/admin-api/vouchers/details/${voucherId}`
    );
    const result = response.data.result;

    const voucherWithFullUrl = {
      ...result,
      imageUrl: result.imageUrl
        ? `/admin-api/s3/${result.imageUrl}`
        : null,
    };

    return voucherWithFullUrl;
  } catch (error) {
    console.error("바우처 상세 조회 실패:", error);
    throw error;
  }
}

// 바우처 전체 조회
export async function getStoresByVoucherId(
  voucherId: number,
  page: number,
  size: number
) {
  const response = await apiClient.get(
    `/admin-api/vouchers/details/${voucherId}/stores`,
    {
      params: { page, size },
    }
  );
  return response.data.result;
}

// 바우처 수정
export async function updateVoucher(
  voucherId: number,
  payload: UpdateVoucherPayload
): Promise<void> {
  try {
    await apiClient.patch(`/admin-api/vouchers/${voucherId}`, payload);
  } catch (error) {
    console.error("바우처 수정 실패:", error);
    throw error;
  }
}

// 바우처 삭제
export async function deleteVoucher(voucherId: number): Promise<void> {
  try {
    await apiClient.delete(`/admin-api/vouchers/${voucherId}`);
  } catch (error) {
    console.error("바우처 삭제 실패:", error);
    throw error;
  }
}

// 바우처 생성하기
export async function createVoucher(payload: VoucherCreateParams) {
  try {
    const response = await apiClient.post(
      `/admin-api/vouchers/create`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("바우처 생성 실패:", error);
    throw error;
  }
}

// Presigned URL을 요청하여 S3에 파일을 업로드할 수 있도록 하는 함수
export async function getPresignedUrl(
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    const response = await apiClient.get(
      `/admin-api/s3/presigned-url/${fileName}`,
      {
        params: { contentType },
      }
    );

    // Presigned URL 반환
    return response.data; // 반환되는 데이터는 S3에 업로드할 수 있는 URL입니다.
  } catch (error) {
    console.error("Presigned URL 요청 실패:", error);
    throw error;
  }
}

// 이미지를 S3에 업로드하는 함수
export async function uploadImageToS3(
  file: File,
  fileName: string,
  contentType: string
) {
  try {
    // 1. Presigned URL을 요청하여 얻기
    const presignedUrl = await getPresignedUrl(fileName, contentType);

    // 2. Presigned URL을 통해 이미지 업로드
    const response = await apiClient.put(presignedUrl, file, {
      headers: {
        "Content-Type": contentType, // 파일의 Content-Type을 설정
      },
    });

    // 3. 업로드 완료 후 처리 (예: 성공 메시지나 파일 URL 반환 등)
    if (response.status === 200) {
      console.log("파일 업로드 성공");
      return `images/${fileName}`;
    } else {
      console.error("파일 업로드 실패");
      throw new Error("파일 업로드 실패");
    }
  } catch (error) {
    console.error("S3 업로드 실패:", error);
    throw error;
  }
}

// 스토어 전체 조회 및 필터링
export async function getStores(
  params: GetStoresParams
): Promise<GetStoresResponse> {
  try {
    const response = await apiClient.get(`/admin-api/vouchers/stores`, {
      params,
    });

    return {
      content: response.data.result.content,
      totalPages: response.data.result.totalPages,
      totalElements: response.data.result.totalElements,
    };
  } catch (error) {
    console.error("스토어 목록 조회 실패:", error);
    throw error;
  }
}

export async function getSidoList(): Promise<string[]> {
  const res = await apiClient.get(`/admin-api/regions/sido`);
  return res.data.result;
}

export async function getSigunguList(sidoName: string): Promise<string[]> {
  const res = await apiClient.get(`/admin-api/regions/sigungu`, {
    params: { sidoName },
  });
  return res.data.result;
}
