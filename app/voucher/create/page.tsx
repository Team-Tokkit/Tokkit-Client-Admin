import VoucherCreatePage from "@/app/voucher/components/VoucherCreatePage"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Page() {
  return <div className="container mx-auto p-2 max-w-6xl">
      <div className="border-b flex items-center mb-4">
        <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5 mb-4" />
        </Button>
        <h1 className="text-2xl font-bold mb-4">바우처 등록</h1>
      </div>
     <VoucherCreatePage />
  </div> 
}