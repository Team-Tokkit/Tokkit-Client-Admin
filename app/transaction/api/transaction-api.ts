import axios from "axios";
import { getApiUrl } from "@/lib/getApiUrl";

const API_URL = getApiUrl();

/**
 * 거래 목록을 불러옵니다.
 * @param params page: 0부터 시작, type: DEPOSIT 등, status: PENDING 등
 */
export async function fetchTransactions(params: {
    page?: number;
    type?: string;
    status?: string;
}) {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.append("page", params.page.toString());
    query.append("size", "10"); // 페이지당 항목 수 고정

    if (params.type) query.append("type", params.type);
    if (params.status) query.append("status", params.status);

    const url = `${API_URL}/admin-api/transactions?${query.toString()}`;

    const response = await axios.get(url);
    return response.data; // { isSuccess, code, message, result: {...page info...} }
}
export async function fetchTransactionDetail(id: number) {
    const url = `${API_URL}/admin-api/transactions/${id}`;
    const res = await axios.get(url);
    return res.data;
}