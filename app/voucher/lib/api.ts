<<<<<<< HEAD
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
=======
import { getApiUrl } from "@/lib/getApiUrl";
import axios from "axios";
import { GetVouchersParams, GetVouchersResponse, UpdateVoucherPayload, VoucherDetail, VoucherCreateParams } from "@/app/voucher/types/Voucher";
import { GetStoresParams, GetStoresResponse } from "@/app/voucher/types/Store"

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
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d

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
<<<<<<< HEAD
export async function getVoucherDetail(
  voucherId: number
): Promise<VoucherDetail> {
  try {
    const response = await apiClient.get(
      `/admin-api/vouchers/details/${voucherId}`
    );
=======
export async function getVoucherDetail(voucherId: number): Promise<VoucherDetail> {
  try {
    const response = await axios.get(`${API_URL}/admin-api/vouchers/details/${voucherId}`);
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
    const result = response.data.result;

    const voucherWithFullUrl = {
      ...result,
<<<<<<< HEAD
      imageUrl: result.imageUrl
        ? `/admin-api/s3/${result.imageUrl}`
        : null,
=======
      imageUrl: result.imageUrl ? `${API_URL}/admin-api/s3/${result.imageUrl}` : null,
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
    };

    return voucherWithFullUrl;
  } catch (error) {
    console.error("바우처 상세 조회 실패:", error);
    throw error;
  }
}

// 바우처 전체 조회
<<<<<<< HEAD
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
=======
export async function getStoresByVoucherId(voucherId: number, page: number, size: number) {
  const API_URL = getApiUrl()
  const response = await axios.get(`${API_URL}/admin-api/vouchers/details/${voucherId}/stores`, {
    params: { page, size },
  })
  return response.data.result
}


// 바우처 수정
export async function updateVoucher(voucherId: number, payload: UpdateVoucherPayload): Promise<void> {
  try {
    await axios.patch(`${API_URL}/admin-api/vouchers/${voucherId}`, payload);
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
  } catch (error) {
    console.error("바우처 수정 실패:", error);
    throw error;
  }
}

// 바우처 삭제
export async function deleteVoucher(voucherId: number): Promise<void> {
  try {
<<<<<<< HEAD
    await apiClient.delete(`/admin-api/vouchers/${voucherId}`);
=======
    await axios.delete(`${API_URL}/admin-api/vouchers/${voucherId}`);
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
  } catch (error) {
    console.error("바우처 삭제 실패:", error);
    throw error;
  }
}

<<<<<<< HEAD
// 바우처 생성하기
export async function createVoucher(payload: VoucherCreateParams) {
  try {
    const response = await apiClient.post(
      `/admin-api/vouchers/create`,
      payload
    );
    return response.data;
=======
// 바우처 생성하기 
export async function createVoucher(payload: VoucherCreateParams) {
  try {
    const response = await axios.post(`${API_URL}/admin-api/vouchers/create`, payload);
    return response.data; 
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
  } catch (error) {
    console.error("바우처 생성 실패:", error);
    throw error;
  }
}

// Presigned URL을 요청하여 S3에 파일을 업로드할 수 있도록 하는 함수
<<<<<<< HEAD
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
=======
export async function getPresignedUrl(fileName: string, contentType: string): Promise<string> {
  try {
    const response = await axios.get(`${API_URL}/admin-api/s3/presigned-url/${fileName}`, {
      params: { contentType },
    });
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d

    // Presigned URL 반환
    return response.data; // 반환되는 데이터는 S3에 업로드할 수 있는 URL입니다.
  } catch (error) {
    console.error("Presigned URL 요청 실패:", error);
    throw error;
  }
}

<<<<<<< HEAD
// 이미지를 S3에 업로드하는 함수
export async function uploadImageToS3(
  file: File,
  fileName: string,
  contentType: string
) {
=======

// 이미지를 S3에 업로드하는 함수
export async function uploadImageToS3(file: File, fileName: string, contentType: string) {
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
  try {
    // 1. Presigned URL을 요청하여 얻기
    const presignedUrl = await getPresignedUrl(fileName, contentType);

    // 2. Presigned URL을 통해 이미지 업로드
<<<<<<< HEAD
    const response = await apiClient.put(presignedUrl, file, {
      headers: {
        "Content-Type": contentType, // 파일의 Content-Type을 설정
=======
    const response = await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': contentType,  // 파일의 Content-Type을 설정
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
      },
    });

    // 3. 업로드 완료 후 처리 (예: 성공 메시지나 파일 URL 반환 등)
    if (response.status === 200) {
<<<<<<< HEAD
      console.log("파일 업로드 성공");
      return `images/${fileName}`;
    } else {
      console.error("파일 업로드 실패");
      throw new Error("파일 업로드 실패");
    }
  } catch (error) {
    console.error("S3 업로드 실패:", error);
=======
      console.log('파일 업로드 성공');
      return `images/${fileName}`;
    } else {
      console.error('파일 업로드 실패');
      throw new Error('파일 업로드 실패');
    }
  } catch (error) {
    console.error('S3 업로드 실패:', error);
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
    throw error;
  }
}

<<<<<<< HEAD
// 스토어 전체 조회 및 필터링
export async function getStores(
  params: GetStoresParams
): Promise<GetStoresResponse> {
  try {
    const response = await apiClient.get(`/admin-api/vouchers/stores`, {
=======



// 스토어 전체 조회 및 필터링
export async function getStores(params: GetStoresParams): Promise<GetStoresResponse> {
  try {
    const response = await axios.get(`${API_URL}/admin-api/vouchers/stores`, {
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
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
<<<<<<< HEAD
  const res = await apiClient.get(`/admin-api/regions/sido`);
  return res.data.result;
}

export async function getSigunguList(sidoName: string): Promise<string[]> {
  const res = await apiClient.get(`/admin-api/regions/sigungu`, {
    params: { sidoName },
  });
  return res.data.result;
=======
  const res = await axios.get(`${API_URL}/admin-api/regions/sido`)
  return res.data.result
}

export async function getSigunguList(sidoName: string): Promise<string[]> {
  const res = await axios.get(`${API_URL}/admin-api/regions/sigungu`, {
    params: { sidoName }
  })
  return res.data.result
>>>>>>> 4b71f2b612e0b12dfadab8957a69b2b89b60de3d
}
