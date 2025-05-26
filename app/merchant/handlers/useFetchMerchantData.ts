import { useCallback } from "react";
import { fetchMerchants } from "../api/merchant";

export const useFetchMerchantData = (setStateFns: {
    setMerchantList: Function;
    setTotalPages: Function;
}) => {
    return useCallback(async (page: number, keyword: string) => {
        try {
            const res = await fetchMerchants({ page, keyword });
            const pageData = res.result;

            const mapped = pageData.content.map((merchant: any) => ({
                ...merchant,
                status: merchant.isDormant ? "비활성" : "활성",
            }));

            setStateFns.setMerchantList(mapped);
            setStateFns.setTotalPages(pageData.totalPages);
        } catch (err) {
            console.error("가맹점 목록 불러오기 실패", err);
        }
    }, []);
};
