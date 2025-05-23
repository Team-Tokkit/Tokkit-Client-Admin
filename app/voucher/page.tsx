'use client'

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import VoucherList from "@/app/voucher/components/VoucherList"
import { useRouter } from "next/navigation" 

export default function VoucherManagement() {
  const router = useRouter() 

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">바우처 관리</h1>
        <Button
          className="bg-black hover:bg-gray-800"
          onClick={() => router.push("/voucher/create")} 
        >
          <PlusIcon className="h-4 w-4" />
          바우처 등록
        </Button>
      </div>

      <VoucherList />
    </div>
  )
}