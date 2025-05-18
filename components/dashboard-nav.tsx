import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    icon: LucideIcon
    variant: "default" | "ghost"
    href: string
  }[]
}

export function DashboardNav({ links, isCollapsed }: NavProps) {
  return (
    <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              buttonVariants({ variant: link.variant, size: "sm" }),
              link.variant === "default" && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
              "justify-start",
              isCollapsed && "h-9 w-9 p-0 justify-center",
            )}
          >
            <link.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span>{link.title}</span>}
            {!isCollapsed && link.label && <span className="ml-auto text-xs">{link.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  )
}
