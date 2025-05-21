import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export function ManageBox({
  onEdit,
  onDelete,
  onChangePin,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onChangePin: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2">
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>수정</DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>삭제</DropdownMenuItem>
        <DropdownMenuItem onClick={onChangePin}>
          간편 비밀번호 변경
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
