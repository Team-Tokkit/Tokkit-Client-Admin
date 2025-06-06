import apiClient from "@/lib/apiClient";

export async function fetchNotices(page: number = 0, keyword: string = "") {
  const response = await apiClient.get(`/admin-api/notice`, {
    params: {
      page,
      keyword,
    },
    withCredentials: true,
  });
  return response.data.result;
}

export async function fetchNoticeDetail(noticeId: number) {
  const response = await apiClient.get(`/admin-api/notice/${noticeId}`, {
    withCredentials: true,
  });
  return response.data.result;
}

export async function createNotice(data: { title: string; content: string }) {
  const response = await apiClient.post(`/admin-api/notice`, data, {
    withCredentials: true,
  });
  return response.data.result;
}

export async function updateNotice(
  noticeId: number,
  data: {
    title: string;
    content: string;
  }
) {
  const response = await apiClient.put(
    `/admin-api/notice/${noticeId}`,
    data,
    {
      withCredentials: true,
    }
  );

  return response.data.result;
}

export const updateNoticeStatus = async (
  noticeId: number,
  isDeleted: boolean
) => {
  try {
    const response = await apiClient.patch(
      `/admin-api/notice/${noticeId}/status`,
      null,
      {
        params: { isDeleted },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("공지사항 상태 업데이트 중 오류 발생:", error);
    throw error;
  }
};
