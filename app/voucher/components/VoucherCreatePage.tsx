"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Plus, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "@/app/voucher/components/DatePickerWithRange"
import { ImageUploader } from "@/app/voucher/components/ImageUploader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import StoreModal from "./StoreModal"

export default function VoucherCreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    totalQuantity: "",
    validityPeriod: {
      from: new Date(),
      to: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    },
    refundPolicy: "",
    contactInfo: "",
    category: "",
    usageLocation: "",
    image: null,
  })

 const [usageLocationModalOpen, setUsageLocationModalOpen] = useState(false); // 추가

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleSelectUsageLocation = () => {
    setUsageLocationModalOpen(true);
  }

  return (
    <div className="max-w-6xl mx-auto bg-white min-h-screen pb-10">

      <form onSubmit={handleSubmit} className="px-4 py-6">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-lg font-medium mb-4">기본 정보</h2>

            <div className="space-y-6">
              <FormField label="바우처 이름" required id="voucher-name" tooltip="바우처의 이름을 입력하세요">
                <Input
                  placeholder="바우처 이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormField>

              <FormField
                label="요약 설명"
                required
                id="voucher-summary"
                tooltip="바우처에 대한 간략한 설명을 입력하세요"
              >
                <Input
                  placeholder="간략한 설명을 입력하세요"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
              </FormField>

              <FormField label="카테고리" required id="voucher-category" tooltip="바우처의 카테고리를 선택하세요">
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FOOD">음식점</SelectItem>
                    <SelectItem value="MEDICAL">의료</SelectItem>
                    <SelectItem value="SERVICE">서비스</SelectItem>
                    <SelectItem value="TOURISM">관광</SelectItem>
                    <SelectItem value="LODGING">숙박</SelectItem>
                    <SelectItem value="EDUCATION">교육</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="정가" required id="voucher-original-price" tooltip="바우처의 원래 가격을 입력하세요">
                  <Input
                    type="number"
                    placeholder="원래 가격"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="pl-8"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    ₩
                  </div>
                </FormField>

                <FormField
                  label="할인가"
                  required
                  id="voucher-discounted-price"
                  tooltip="바우처의 할인된 가격을 입력하세요"
                >
                  <Input
                    type="number"
                    placeholder="할인된 가격"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                    className="pl-8"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    ₩
                  </div>
                </FormField>

                <FormField label="총 수량" required id="voucher-quantity" tooltip="바우처의 총 발행 수량을 입력하세요">
                  <Input
                    type="number"
                    placeholder="총 수량"
                    value={formData.totalQuantity}
                    onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
                  />
                </FormField>
              </div>

              <FormField
                label="사용 유효기간"
                required
                id="voucher-validity"
                tooltip="바우처의 사용 가능 기간을 설정하세요"
              >
                <DatePickerWithRange
                  date={formData.validityPeriod}
                  setDate={(date) => setFormData({ ...formData, validityPeriod: date })}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-lg font-medium mb-4">상세 정보</h2>

            <div className="space-y-6">
              <FormField
                label="상세 설명"
                required
                id="voucher-description"
                tooltip="바우처에 대한 자세한 설명을 입력하세요"
              >
                <Textarea
                  placeholder="바우처에 대한 자세한 설명을 입력하세요"
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </FormField>

              <FormField label="환불 정책" required id="voucher-refund" tooltip="바우처의 환불 정책을 설명하세요">
                <Textarea
                  placeholder="환불 정책에 대한 설명을 입력하세요"
                  className="min-h-[100px]"
                  value={formData.refundPolicy}
                  onChange={(e) => setFormData({ ...formData, refundPolicy: e.target.value })}
                />
              </FormField>

              <FormField
                label="문의 연락처"
                required
                id="voucher-contact"
                tooltip="고객 문의를 받을 연락처를 입력하세요"
              >
                <Input
                  placeholder="연락처 정보를 입력하세요 (예: 010-1234-5678)"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-lg font-medium mb-4">사용처 및 이미지</h2>

            <div className="space-y-6">
              <FormField
      label="사용처 선택"
      required
      id="voucher-usage-location"
      tooltip="바우처를 사용할 수 있는 장소를 선택하세요"
    >
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={handleSelectUsageLocation}
          className="w-full justify-start text-gray-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          사용처 선택하기
        </Button>
        {formData.usageLocation && (
          <div className="mt-2 p-3 border rounded-md">{formData.usageLocation}</div>
        )}
      </div>
    </FormField>

        {/* 전체화면 모달 */}
        <StoreModal
  open={usageLocationModalOpen}
  onOpenChange={setUsageLocationModalOpen}
/>
      
              <FormField
                label="바우처 이미지"
                required
                id="voucher-image"
                tooltip="바우처를 대표하는 이미지를 업로드하세요"
              >
                <ImageUploader onImageChange={(image) => setFormData({ ...formData, image })} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" type="button">
            취소
          </Button>
          <Button type="submit" className="bg-black text-white hover:bg-black/90 px-6">
            바우처 등록
          </Button>
        </div>
      </form>
    </div>
  )
}

interface FormFieldProps {
  label: string
  required: boolean
  children: React.ReactNode
  id: string
  tooltip?: string
}

function FormField({ label, required, children, id, tooltip }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor={id} className="flex items-center text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}
