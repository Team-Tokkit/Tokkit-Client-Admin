import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  user: { id: number; name: string };
  onClose: () => void;
  onChangePin: (newPin: string) => void;
}

export default function PinChangeModal({ user, onClose, onChangePin }: Props) {
  const [pin, setPin] = useState("");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>{user.name}님의 간편 비밀번호 변경</DialogTitle>
        </DialogHeader>
        <Input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="새로운 비밀번호 (숫자 6자리)"
          maxLength={6}
        />

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button
            onClick={() => {
              if (pin.length === 6) {
                onChangePin(pin);
              } else {
                alert("비밀번호는 6자리여야 합니다.");
              }
            }}
          >
            변경
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
