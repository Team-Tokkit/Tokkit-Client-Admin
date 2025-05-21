import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  user: { id: number; name: string };
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ user, onClose, onConfirm }: Props) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 삭제</DialogTitle>
        </DialogHeader>
        <p>{user.name}님을 정말 삭제하시겠습니까?</p>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
