import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Space, Table, Upload, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
// import { List } from "react-window";
import { exportToExcel, importFromExcel } from "@/utils/excel";

type Fetcher<T, Q = any> = (params: { current: number; pageSize: number } & Q) => Promise<{
  data: T[];
  total: number;
}>;

type ExcelMapper<T> = {
  toExportRow: (row: T) => Record<string, unknown>;
  fromImportRow: (row: Record<string, unknown>) => Partial<T>;
  filenamePrefix?: string;
  sheetName?: string;
};

type VirtualOptions = {
  itemHeight: number; // 建议固定高度
  overscan?: number;
  height?: number; // 可视高度，不传则用 Table.scroll.y
};

type InfiniteScrollOptions = {
  threshold?: number; // 触底阈值（行数）
};

type ExcelTableProps<T extends object, Q = any> = {
  title: string;
  columns: ColumnsType<T>;
  fetcher: Fetcher<T, Q>;
  initialQuery?: Q;
  query?: Q; // 外部控制查询条件
  operationExtra?: ReactNode;
  exportEnabled?: boolean;
  importEnabled?: boolean;
  excelMapper: ExcelMapper<T>;
  tableProps?: Omit<React.ComponentProps<typeof Table<T>>, "columns" | "dataSource" | "loading" | "pagination" | "rowKey">;
  rowKey?: string;
  virtual?: VirtualOptions; // 可选虚拟列表
  infiniteScroll?: InfiniteScrollOptions; // 可选懒加载
};

export default function ExcelTable<T extends { _id?: string }, Q = any>({
  title,
  columns,
  fetcher,
  initialQuery,
  query: externalQuery,
  operationExtra,
  exportEnabled = true,
  importEnabled = true,
  excelMapper,
  tableProps,
  rowKey = "_id",
  virtual,
  infiniteScroll,
}: ExcelTableProps<T, Q>) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<Q>(initialQuery as Q);
  const effectiveQuery = (externalQuery ?? query) as Q;
  const [pagination, setPagination] = useState<TablePaginationConfig>({ current: 1, pageSize: 20, showSizeChanger: true });
  const appendingRef = useRef<boolean>(false);

  const load = useCallback(async (append = false) => {
    setLoading(!append);
    appendingRef.current = append;
    try {
      const res = await fetcher({ current: pagination.current as number, pageSize: pagination.pageSize as number, ...(effectiveQuery as any) });
      if (append) {
        setData(prev => [...prev, ...res.data]);
        setTotal(prev => Math.max(prev, res.total));
      } else {
        setData(res.data);
        setTotal(res.total);
      }
    } finally {
      setLoading(false);
      appendingRef.current = false;
    }
  }, [fetcher, pagination, effectiveQuery]);

  useEffect(() => { load(false); }, [load]);

  // 外部查询条件变化时，重置到第一页
  const externalQueryString = JSON.stringify(externalQuery);
  useEffect(() => {
    setPagination(prev => ({ ...prev, current: 1 }));
  }, [externalQueryString]);

  const handleExport = useCallback(async () => {
    const rows = data.map(excelMapper.toExportRow);
    await exportToExcel(rows, { filename: `${excelMapper.filenamePrefix || title}_${dayjs().format("YYYYMMDD_HHmmss")}`, sheetName: excelMapper.sheetName || title });
    message.success("导出成功");
  }, [data, excelMapper, title]);

  const beforeUpload = useCallback(async (file: File) => {
    try {
      const rows = await importFromExcel(file);
      const mapped = rows.map(excelMapper.fromImportRow) as T[];
      setData(mapped);
      setTotal(mapped.length);
      message.success("导入成功（仅本地预览，未提交服务器）");
    } catch (e) {
      message.error("导入失败，请检查文件格式");
    }
    return false;
  }, [excelMapper]);

  const operation = useMemo(() => (
    <Space>
      {importEnabled && (
        <Upload beforeUpload={beforeUpload} showUploadList={false} accept=".xlsx,.xls">
          <Button>导入Excel</Button>
        </Upload>
      )}
      {exportEnabled && <Button onClick={handleExport}>导出Excel</Button>}
      {operationExtra}
    </Space>
  ), [beforeUpload, handleExport, importEnabled, exportEnabled, operationExtra]);

  // 虚拟 body 渲染
  const components = useMemo(() => {
    if (!virtual) return undefined;
    const itemHeight = virtual.itemHeight;
    const overscan = virtual.overscan ?? 8;

    // antd 会把 <tr> 数组传入 children
    const VirtualBody = (raw: any) => {
      const { children, ...rest } = raw;
      const rows = children as React.ReactElement[];
      const height = virtual.height || (tableProps as any)?.scroll?.y || 600;

      const Row = ({ index, style }: { index: number; style: React.CSSProperties }) =>
        rows[index] ? (rows[index] as any).type ? (
          // 克隆行，附加虚拟列表提供的定位 style
          (rows[index] as any).type === 'tr'
            ? rows[index]
            : (React.cloneElement(rows[index], { style }))
        ) : null : null;

      return (
        <div style={{ height: height, overflow: 'auto' }}>
          {rows.map((row, index) => (
            <div key={index} style={{ height: itemHeight }}>
              {row}
            </div>
          ))}
        </div>
      );
    };

    return { body: VirtualBody as any };
  }, [virtual, tableProps]);

  // 懒加载：当可视末端接近最后一行时，翻下一页追加
  const onTableChange = (pg: TablePaginationConfig) => {
    setPagination(pg);
  };

  const onItemsRendered = useCallback((visibleStopIndex: number) => {
    if (!infiniteScroll || appendingRef.current) return;
    const threshold = infiniteScroll.threshold ?? 5;
    if (visibleStopIndex >= (data.length - 1 - threshold)) {
      // 翻下一页
      setPagination(prev => ({ ...prev, current: (prev.current as number) + 1 }));
      // 触发追加加载
      load(true);
    }
  }, [data.length, infiniteScroll, load]);

  // 当启用虚拟滚动+懒加载时，用一个小的 footer 占位来触发 onItemsRendered
  const tableFooter = useMemo(() => {
    if (!virtual || !infiniteScroll) return undefined;
    const FooterComponent = () => (
      <div style={{ height: 1 }} />
    );
    FooterComponent.displayName = 'TableFooter';
    return FooterComponent;
  }, [virtual, infiniteScroll]);

  // 包一层，捕获 react-window 可视区信息
  const tableWithVirtual = useMemo(() => {
    if (!virtual) return null;
    const itemHeight = virtual.itemHeight;
    const height = virtual.height || (tableProps as any)?.scroll?.y || 600;
    const visibleCount = Math.ceil((height as number) / itemHeight);
    // 简单推断可视末行索引
    const visibleStopIndex = Math.min(data.length - 1, visibleCount - 1);
    if (infiniteScroll) {
      onItemsRendered(visibleStopIndex);
    }
    return null;
  }, [virtual, infiniteScroll, tableProps, data.length, onItemsRendered]);

  return (
    <>
      <div style={{ fontSize: 18, fontWeight: 600, margin: "8px 0 12px" }}>
        {title}
        <span style={{ float: "right" }}>{operation}</span>
      </div>
      {tableWithVirtual}
      <Table<T>
        rowKey={rowKey as any}
        columns={columns}
        dataSource={data}
        loading={loading}
        onChange={onTableChange}
        pagination={{ ...pagination, total: total, showTotal: () => `共 ${total} 条` }}
        components={components as any}
        footer={tableFooter}
        {...tableProps}
      />
    </>
  );
}


