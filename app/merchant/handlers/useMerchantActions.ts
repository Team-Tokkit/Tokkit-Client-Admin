import { updateMerchant, updateMerchantStatus, fetchMerchantDetail } from "../api/merchant";

export const useMerchantActions = ({
                                       fetchMerchantData,
                                       setSelectedMerchant,
                                       setIsDetailOpen,
                                   }: any) => {
    const handleToggleStatus = async (merchantId: number, currentStatus: string) => {
        const newIsDormant = currentStatus === "활성";
        try {
            await updateMerchantStatus(merchantId, newIsDormant);
            fetchMerchantData();
        } catch (err) {
            console.error("상태 변경 실패", err);
        }
    };

    const handleSaveMerchant = async (updated: any, currentMerchant: any) => {
        try {
            const phone = updated.phoneNumber || currentMerchant?.phoneNumber;
            console.log("updated", updated);
            console.log(phone);
            const response = await updateMerchant(updated.id, {
                name: updated.name,
                phoneNumber: phone,
                pin: updated.pin,
            });

            if (response.isSuccess) {
                await fetchMerchantData();
                setSelectedMerchant(null);
                setIsDetailOpen(false);
            } else {
                console.error("가맹점 수정 실패");
            }
        } catch (err) {
            console.error("가맹점 수정 중 오류 발생", err);
        }
    };

    const handleViewMerchant = async (merchant: any) => {
        const merchantDetail = await fetchMerchantDetail(merchant.id);
        setSelectedMerchant(merchantDetail);
        setIsDetailOpen(true);
    };

    return { handleToggleStatus, handleSaveMerchant, handleViewMerchant };
};
