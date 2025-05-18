"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"

interface Column {
  key: string
  header: string
  cell: (item: any) => React.ReactNode
  className?: string
  hideOnMobile?: boolean
}

interface ResponsiveTableProps {
  data: any[]
  columns: Column[]
  emptyMessage?: string
}

export function ResponsiveTable({ data, columns, emptyMessage = "데이터가 없습니다." }: ResponsiveTableProps) {
  if (!data || data.length === 0) {
    return <Card className="p-6 text-center text-muted-foreground">{emptyMessage}</Card>
  }

  // 모바일 뷰 (카드 형태)
  const MobileView = () => (
    <div className="space-y-4 md:hidden">
      {data.map((item, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-2">
            {columns
              .filter((col) => !col.hideOnMobile)
              .map((column) => (
                <div key={column.key} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-muted-foreground">{column.header}</span>
                  <div className="text-sm text-right">{column.cell(item)}</div>
                </div>
              ))}
          </div>
        </Card>
      ))}
    </div>
  )

  // 데스크톱 뷰 (테이블 형태)
  const DesktopView = () => (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.cell(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  )
}
