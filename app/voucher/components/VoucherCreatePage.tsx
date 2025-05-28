'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createVoucher } from "@/app/voucher/lib/api";
import CreateForm from "./CreateForm";
import StoreModal from "./StoreModal";
import { VoucherCreateParams } from "../types/Voucher";
import { StoreListItem } from "../types/Store";

interface FormData {
  name: string;
  description: string;
  detailDescription: string;
  originalPrice: string;
  price: string;
  totalCount: string;
  validDate: {
    from: Date;
    to: Date;
  };
  refundPolicy: string;
  contact: string;
  storeCategory: string;
  usageLocation: string;
  image: string | File | null;  
  storeIds: number[];
}

export default function VoucherCreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    detailDescription: "",
    originalPrice: "",
    price: "",
    totalCount: "",
    validDate: {
      from: new Date(),
      to: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    },
    refundPolicy: "",
    contact: "",
    storeCategory: "",
    usageLocation: "",
    image: null, 
    storeIds: [] as number[],
  });

  const [usageLocationModalOpen, setUsageLocationModalOpen] = useState(false);

  const handleImageChange = (imageUrl: string | File | null) => {
    setFormData({ ...formData, image: imageUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validDateString = formData.validDate.to.toISOString().split("T").join("T").split(".")[0];

    const requestPayload: VoucherCreateParams = {
      name: formData.name,
      description: formData.description,
      detailDescription: formData.detailDescription,
      originalPrice: parseInt(formData.originalPrice, 10),
      price: parseInt(formData.price, 10),
      totalCount: parseInt(formData.totalCount, 10),
      remainingCount: parseInt(formData.totalCount, 10),
      validDate: validDateString, // 수정된 validDate
      refundPolicy: formData.refundPolicy,
      contact: formData.contact,
      storeCategory: formData.storeCategory, 
      storeIds: formData.storeIds,
      imageUrl: formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image || "",
    };

    try {
      await createVoucher(requestPayload);
      alert("바우처가 성공적으로 생성되었습니다!");
      router.push("/voucher");
    } catch (error) {
      console.error("바우처 생성 실패:", error);
      alert("바우처 생성에 실패했습니다.");
    }
  };

  const handleSelectUsageLocation = () => {
    setUsageLocationModalOpen(true);
  };

  const handleStoreConfirm = (storeIds: number[], storeList: StoreListItem[]) => { 
    console.log("Selected Store IDs:", storeIds);

    const names = storeList.map((s) => s.storeName).join(", ");
    setFormData({ ...formData, storeIds: storeIds, usageLocation: names });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white min-h-screen pb-10">
      <form onSubmit={handleSubmit} className="px-4 py-6">
        <CreateForm
          formData={formData}
          setFormData={setFormData}
          handleSelectUsageLocation={handleSelectUsageLocation}
          handleStoreConfirm={handleStoreConfirm}
        />
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" type="button">
            취소
          </Button>
          <Button data-cy="voucher-submit-button" type="submit" className="bg-black text-white hover:bg-black/90 px-6">
            바우처 등록
          </Button>
        </div>
      </form>

      <StoreModal
        open={usageLocationModalOpen}
        onOpenChange={setUsageLocationModalOpen}
        onConfirm={handleStoreConfirm}
      />
    </div>
  );
}
