import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface DropBoxItem {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    danger?: boolean;
    disabled?: boolean;
}

interface DropBoxProps {
    isOpen: boolean;
    onToggle: () => void;
    items: DropBoxItem[];
}

export default function DropBox({ isOpen, onToggle, items }: DropBoxProps) {
    const triggerRef = useRef<HTMLDivElement>(null);
    const menuHeight = items.length * 40;
    const margin = 8;

    const [openUpward, setOpenUpward] = useState(false);

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            setOpenUpward(
                spaceBelow < menuHeight + margin && spaceAbove > menuHeight + margin
            );
        }
    }, [isOpen, items.length]);

    return (
        <div
            className="relative inline-block text-left dropdown-trigger"
    ref={triggerRef}
    >
    <Button variant="ghost" onClick={onToggle} type="button">
        ⋮
      </Button>
    {isOpen && (
        <div
            className={`absolute right-0 z-50 w-40 bg-white border rounded shadow text-sm ${
            openUpward ? "bottom-full mb-2" : "top-full mt-2"
        }`}
    >
        {items.map((item, index) => (
            <button
                key={index}
            onClick={item.onClick}
            disabled={item.disabled}
            className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 ${
                item.danger ? "text-red-600" : ""
            } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {item.icon}
            {item.label}
            </button>
        ))}
        </div>
    )}
    </div>
);
}
