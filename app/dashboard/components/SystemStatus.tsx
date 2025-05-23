import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/Page-Header";
import { getStatusStyles, StatusColor } from "@/lib/statusStyle";

interface StatusRowProps {
  label: string;
  status: string;
  color: StatusColor;
}

export function DashboardSystemStatus() {
  return (
    <Card>
      <CardHeader>
        <PageHeader
          title="시스템 상태"
          description="현재 시스템의 상태를 확인합니다."
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <StatusRow label="API 서버" status="정상" color="green" />
          <StatusRow label="데이터베이스" status="정상" color="green" />
          <StatusRow label="결제 시스템" status="정상" color="green" />
          <StatusRow label="알림 서비스" status="부분 지연" color="yellow" />
        </div>
      </CardContent>
    </Card>
  );
}

function StatusRow({ label, status, color }: StatusRowProps) {
  const { bgColor, textColor } = getStatusStyles(color);

  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <span className={`flex items-center ${textColor}`}>
        <span className={`h-2 w-2 rounded-full mr-2 ${bgColor}`} />
        {status}
      </span>
    </div>
  );
}
