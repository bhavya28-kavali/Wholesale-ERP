import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import EmptyState from './EmptyState';
import { TableSkeleton } from './Skeleton';

const Table = ({
  columns,
  data,
  keyField = '_id',
  loading = false,
  emptyTitle,
  emptyDescription,
  onRowClick,
  selectable = false,
  selectedIds = [],
  onSelectChange,
}) => {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortable) return data;
    return [...data].sort((a, b) => {
      const av = col.accessor ? col.accessor(a) : a[sortKey];
      const bv = col.accessor ? col.accessor(b) : b[sortKey];
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir, columns]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (loading) return <TableSkeleton cols={columns.length} />;

  if (!data.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const allSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/50 dark:border-slate-700/60 dark:bg-slate-900/50">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/50">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) =>
                    onSelectChange?.(e.target.checked ? data.map((r) => r[keyField]) : [])
                  }
                  className="rounded border-slate-300"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium text-slate-600 dark:text-slate-300 ${
                  col.sortable ? 'cursor-pointer select-none hover:text-indigo-600' : ''
                }`}
                onClick={col.sortable ? () => toggleSort(col.key) : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    sortDir === 'asc' ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => (
            <tr
              key={row[keyField]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-slate-100 transition-colors last:border-0 dark:border-slate-800 ${
                idx % 2 === 1 ? 'bg-slate-50/40 dark:bg-slate-800/20' : ''
              } ${onRowClick ? 'cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'}`}
            >
              {selectable && (
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row[keyField])}
                    onChange={(e) => {
                      const id = row[keyField];
                      if (e.target.checked) onSelectChange?.([...selectedIds, id]);
                      else onSelectChange?.(selectedIds.filter((x) => x !== id));
                    }}
                    className="rounded border-slate-300"
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
