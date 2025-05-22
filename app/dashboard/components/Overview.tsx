import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/Page-Header";
import { recentVouchers, recentNotices } from "../api/dashboard";

export function DashboardOverview() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <PageHeader
            title="최근 발행된 바우처"
            description="최근에 발행된 바우처 목록입니다."
          />
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {recentVouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium">{voucher.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {voucher.date}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    voucher.status === "활성"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {voucher.status}
                </span>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => router.push("/voucher")}
          >
            모든 바우처 보기
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <PageHeader
            title="최근 공지사항"
            description="최근에 등록된 공지사항입니다."
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotices.map((notice) => (
              <div
                key={notice.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium">{notice.title}</p>
                  <p className="text-sm text-muted-foreground">{notice.date}</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => router.push("/notice")}
          >
            모든 공지사항 보기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
