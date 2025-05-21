"use client";

import { Card } from "@/components/ui/card";
import { ResponsiveTable } from "@/components/responsive-table";
import Pagination from "@/components/common/Pagination";

interface Column<T> {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
}

interface ListProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowDetailFetcher?: (item: T) => Promise<any>;
}

export default function List<T>({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
}: ListProps<T>) {
  return (
    <Card className="overflow-hidden">
      <ResponsiveTable
        data={data}
        columns={columns}
        emptyMessage="내역이 없습니다."
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </Card>
  );
}
