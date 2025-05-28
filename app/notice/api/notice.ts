import axios from "axios";
import { getApiUrl } from "@/lib/getApiUrl";

const API_URL = getApiUrl();

export async function fetchNotices(page: number = 0, keyword: string = "") {
  const response = await axios.get(`${API_URL}/admin-api/notice`, {
    params: {
      page,
      keyword,
    },
  });
  return response.data.result;
}

export async function fetchNoticeDetail(noticeId: number) {
  const response = await axios.get(`${API_URL}/admin-api/notice/${noticeId}`);
  return response.data.result;
}

export async function createNotice(data: { title: string; content: string }) {
  const response = await axios.post(`${API_URL}/admin-api/notice`, data);
  return response.data.result;
}

export async function updateNotice(
  noticeId: number,
  data: {
    title: string;
    content: string;
  }
) {
  const response = await axios.put(
    `${API_URL}/admin-api/notice/${noticeId}`,
    data
  );
  return response.data.result;
}

export const updateNoticeStatus = async (noticeId: number, isDeleted: boolean) => {
  try {
    const response = await axios.patch(
      `${API_URL}/admin-api/notice/${noticeId}/status`,
      null, 
      {
        params: { isDeleted },
      }
    );
    return response.data;
  } catch (error) {
    console.error("공지사항 상태 업데이트 중 오류 발생:", error);
    throw error;
  }
};
