import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "@/app/voucher/components/DatePickerWithRange"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import FormField from "@/app/voucher/components/FormFiled"
import { StoreListItem } from "../types/Store"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ImageUploader } from "./ImageUploader"

interface FormData {
  name: string
  description: string
  detailDescription: string
  originalPrice: string
  price: string
  totalCount: string
  validDate: {
    from: Date
    to: Date
  }
  refundPolicy: string
  contact: string
  storeCategory: string
  usageLocation: string
  image: string | File | null
  storeIds: number[]
}

interface CreateFormProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  handleSelectUsageLocation: () => void
  handleStoreConfirm: (storeIds: number[], storeList: StoreListItem[]) => void
}

const categoryMap: { [key: string]: string } = {
  "음식점": "FOOD",
  "의료": "MEDICAL",
  "서비스": "SERVICE",
  "관광": "TOURISM",
  "숙박": "LODGING",
  "교육": "EDUCATION"
};

const CreateForm = ({
  formData,
  setFormData,
  handleSelectUsageLocation,
  handleStoreConfirm,
}: CreateFormProps) => {
  
  const handleImageUpload = async (imageUrl: string) => {
    setFormData({ ...formData, image: imageUrl })
  }

  return (
    <div>
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

            <FormField label="요약 설명" required id="voucher-summary" tooltip="바우처에 대한 간략한 설명을 입력하세요">
              <Input
                placeholder="간략한 설명을 입력하세요"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </FormField>

            <FormField label="카테고리" required id="voucher-category" tooltip="바우처의 카테고리를 선택하세요">
              <Select
                value={formData.storeCategory}
                onValueChange={(value) => setFormData({ ...formData, storeCategory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="음식점">음식점</SelectItem>
                  <SelectItem value="의료">의료</SelectItem>
                  <SelectItem value="서비스">서비스</SelectItem>
                  <SelectItem value="관광">관광</SelectItem>
                  <SelectItem value="숙박">숙박</SelectItem>
                  <SelectItem value="교육">교육</SelectItem>
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
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₩</div>
              </FormField>

              <FormField label="할인가" required id="voucher-discounted-price" tooltip="바우처의 할인된 가격을 입력하세요">
                <Input
                  type="number"
                  placeholder="할인된 가격"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="pl-8"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">₩</div>
              </FormField>

              <FormField label="총 수량" required id="voucher-quantity" tooltip="바우처의 총 발행 수량을 입력하세요">
                <Input
                  type="number"
                  placeholder="총 수량"
                  value={formData.totalCount}
                  onChange={(e) => setFormData({ ...formData, totalCount: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="사용 유효기간" required id="voucher-validity" tooltip="바우처의 사용 가능 기간을 설정하세요">
              <DatePickerWithRange
                date={formData.validDate}
                setDate={(date) => setFormData({ ...formData, validDate: date })}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-lg font-medium mb-4">상세 정보</h2>

          <div className="space-y-6">
            <FormField label="상세 설명" required id="voucher-description" tooltip="바우처에 대한 자세한 설명을 입력하세요">
              <Textarea
                placeholder="바우처에 대한 자세한 설명을 입력하세요"
                className="min-h-[150px]"
                value={formData.detailDescription}
                onChange={(e) => setFormData({ ...formData, detailDescription: e.target.value })}
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

            <FormField label="문의 연락처" required id="voucher-contact" tooltip="고객 문의를 받을 연락처를 입력하세요">
              <Input
                placeholder="연락처 정보를 입력하세요 (예: 010-1234-5678)"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-lg font-medium mb-4">사용처 및 이미지</h2>

          <div className="space-y-6">
            <FormField label="사용처 선택" required id="voucher-usage-location" tooltip="바우처를 사용할 수 있는 장소를 선택하세요">
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

            <FormField label="바우처 이미지" required id="voucher-image" tooltip="바우처를 대표하는 이미지를 업로드하세요">
              <ImageUploader onImageChange={handleImageUpload} />
            </FormField>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateForm;
