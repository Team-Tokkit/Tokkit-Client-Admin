// app/merchant/components/MerchantViewDialog.tsx

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Merchant {
    id: number;
    name: string;
    phoneNumber: string;
    status: "활성" | "비활성";
    createdAt: string;
    email: string;
}

interface Props {
    open: boolean;
    merchant: Merchant;
    onClose: () => void;
    onEdit: () => void;
}

export default function MerchantViewDialog({ open, merchant, onClose, onEdit }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>가맹점 상세정보</DialogTitle>
                    <DialogDescription>가맹점의 상세 정보입니다.</DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4 text-sm">
                    <InfoRow label="상태" value={
                        <Badge className={merchant.status === "활성" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {merchant.status}
                        </Badge>
                    } />
                    <InfoRow label="이름" value={merchant.name} />
                    <InfoRow label="ID" value={merchant.id} />
                    <InfoRow label="이메일" value={merchant.email} />
                    <InfoRow label="전화번호" value={merchant.phoneNumber} />
                    <InfoRow label="가입일" value={new Date(merchant.createdAt).toLocaleDateString("ko-KR")} />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>닫기</Button>
                    <Button onClick={onEdit}>수정</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function InfoRow({ label, value }: { label: string; value: any }) {
    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-semibold">{label}</div>
            <div className="col-span-3">{value}</div>
        </div>
    );
}
