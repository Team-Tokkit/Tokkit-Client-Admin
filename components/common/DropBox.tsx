import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface DropBoxProps {
  isOpen: boolean;
  onToggle: () => void;
  onView?: () => void;
  onEdit?: () => void;
}

export default function DropBox({
  isOpen,
  onToggle,
  onView,
  onEdit,
}: DropBoxProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuHeight = 80;
  const margin = 8;

  const [openUpward, setOpenUpward] = useState(false);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (
        spaceBelow < menuHeight + margin &&
        spaceAbove > menuHeight + margin
      ) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  return (
    <div
      className="relative inline-block text-left dropdown-trigger"
      ref={triggerRef}
    >
      <Button variant="ghost" onClick={onToggle}>
        ⋮
      </Button>

      {isOpen && (
        <div
          className={`absolute right-0 z-50 w-40 bg-white border rounded shadow ${
            openUpward ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {onView && (
            <button
              onClick={onView}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              상세보기
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              수정하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
