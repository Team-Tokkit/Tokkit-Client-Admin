"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { uploadImageToS3 } from "../lib/api"

interface ImageUploaderProps {
  onImageChange?: (imageUrl: string) => void; // string 타입으로 수정
}

export function ImageUploader({ onImageChange }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        setPreview(reader.result as string)

        try {
          const contentType = file.type
          const fileName = file.name
          const imageUrl = await uploadImageToS3(file, fileName, contentType)

          onImageChange?.(imageUrl)  
        } catch (error) {
          console.error("이미지 업로드 실패:", error)
          alert("이미지 업로드에 실패했습니다.")
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0] || null
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        setPreview(reader.result as string)

        try {
          const contentType = file.type
          const fileName = file.name
          const imageUrl = await uploadImageToS3(file, fileName, contentType)

          onImageChange?.(imageUrl) 
        } catch (error) {
          console.error("이미지 업로드 실패:", error)
          alert("이미지 업로드에 실패했습니다.")
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onImageChange?.("")
  }

  return (
    <div>
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium">클릭하여 업로드</span> 또는 이미지를 여기에 드래그하세요
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF 파일 (최대 10MB)</p>
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              이미지 선택
            </Button>
          </div>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
