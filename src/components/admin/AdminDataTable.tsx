import type { ReactNode } from "react";

export type AdminTableColumn<T> = {
  header: string;
  render: (row: T) => ReactNode;
};

export function AdminDataTable<T>({
  rows,
  columns,
  getKey,
}: {
  rows: T[];
  columns: AdminTableColumn<T>[];
  getKey: (row: T) => string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
            {columns.map((column) => (
              <th key={column.header} className="px-3 py-3 font-semibold">{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getKey(row)} className="border-b border-slate-50 last:border-0">
              {columns.map((column) => (
                <td key={column.header} className="px-3 py-3.5 text-slate-600">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
