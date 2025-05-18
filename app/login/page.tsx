"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // 입력 시 에러 메시지 초기화
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: "", password: "", general: "" }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요."
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요."
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요."
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // useAuth의 login 함수 사용
      const success = await login(formData.email, formData.password, formData.rememberMe)

      if (success) {
        console.log("로그인 성공, 리다이렉트 중...")
        router.push("/")
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "이메일 또는 비밀번호가 올바르지 않습니다.",
        }))
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error)
      setErrors((prev) => ({
        ...prev,
        general: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image src="/login-background.png" alt="배경" fill priority className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100/70 to-gray-200/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-10"></div>
      </div>

      {/* 장식용 원형 그라데이션 */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md px-4 py-8 sm:px-0">
        <Card className="w-full backdrop-blur-md bg-white/80 border-white/20 shadow-2xl">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Image
              src="/admin-interface.png"
              alt="로고"
              width={80}
              height={80}
              className="rounded-full border-4 border-white/50"
            />
          </div>

          <CardHeader className="space-y-2 text-center pt-16">
            <CardTitle className="text-2xl font-bold text-gray-800">관리자 대시보드</CardTitle>
            <CardDescription className="text-gray-600">계정 정보를 입력하여 로그인하세요.</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errors.general && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-700 px-4 py-3 rounded-md text-sm">
                  {errors.general}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  이메일
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-400"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  비밀번호
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                  disabled={isLoading}
                  className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal text-gray-700">
                  로그인 상태 유지
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 관리자 대시보드. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
