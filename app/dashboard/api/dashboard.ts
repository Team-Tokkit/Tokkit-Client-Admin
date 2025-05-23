export interface StatItem {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
}

export const stats: StatItem[] = [
  {
    title: "총 바우처 수",
    value: "1,234",
    change: "+12%",
    changeType: "increase",
  },
  {
    title: "활성 사용자",
    value: "5,678",
    change: "+7.3%",
    changeType: "increase",
  },
  {
    title: "판매자 수",
    value: "246",
    change: "+2.5%",
    changeType: "increase",
  },
  {
    title: "이번 달 매출",
    value: "₩12,345,678",
    change: "-3.2%",
    changeType: "decrease",
  },
];

export interface VoucherItem {
  id: string;
  name: string;
  status: string;
  date: string;
}

export const recentVouchers: VoucherItem[] = [
  {
    id: "V001",
    name: "맛있는 식당 30% 할인",
    status: "활성",
    date: "2023-05-15",
  },
  {
    id: "V002",
    name: "행복 카페 아메리카노 1+1",
    status: "활성",
    date: "2023-05-14",
  },
  {
    id: "V003",
    name: "뷰티살롱 헤어컷 50% 할인",
    status: "소진",
    date: "2023-05-12",
  },
];

export interface NoticeItem {
  id: number;
  title: string;
  date: string;
}

export const recentNotices: NoticeItem[] = [
  { id: 1, title: "시스템 점검 안내", date: "2023-05-15" },
  { id: 2, title: "바우처 발행 정책 변경 안내", date: "2023-05-10" },
  { id: 3, title: "신규 판매자 등록 절차 안내", date: "2023-05-05" },
];
