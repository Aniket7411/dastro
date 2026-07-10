import { useMemo, useState } from 'react';
import {
  compareSortValues,
  getSortValue,
  pluralize,
} from '../../utils/adminTableUtils';

function DefaultEmpty({ icon: Icon, title, message }) {
  return (
    <div className="admin-table-empty">
      {Icon && <Icon size={32} strokeWidth={1.5} className="admin-table-empty__icon" />}
      {!Icon && <i className="fas fa-inbox admin-table-empty__icon-fa" />}
      <div className="admin-table-empty__title">{title}</div>
      {message && <div className="admin-table-empty__message">{message}</div>}
    </div>
  );
}

function TableLoading({ message = 'Loading records…' }) {
  return (
    <div className="admin-table-loading">
      <div className="admin-table-loading__spin" />
      <span>{message}</span>
    </div>
  );
}

export default function AdminDataTable({
  columns = [],
  data = [],
  rowKey = '_id',
  loading = false,
  loadingMessage,
  emptyTitle = 'No records found',
  emptyMessage,
  emptyIcon,
  emptyAction,
  title,
  subtitle,
  entityLabel = 'record',
  totalCount,
  filteredCount,
  minWidth = 720,
  stickyHeader = true,
  className = '',
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const column = columns.find((col) => col.key === sortKey);
    if (!column) return data;

    return [...data].sort((rowA, rowB) => {
      const result = compareSortValues(
        getSortValue(rowA, column),
        getSortValue(rowB, column)
      );
      return sortDir === 'asc' ? result : -result;
    });
  }, [columns, data, sortDir, sortKey]);

  const visibleCount = filteredCount ?? data.length;
  const total = totalCount ?? data.length;
  const isFiltered = total !== visibleCount;

  const handleSort = (column) => {
    if (!column.sortable || !column.key) return;
    if (sortKey === column.key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(column.key);
    setSortDir('asc');
  };

  return (
    <div className={`admin-table-shell ${className}`.trim()}>
      {(title || subtitle) && (
        <div className="admin-table-shell__bar">
          <div>
            {title && <div className="admin-table-shell__title">{title}</div>}
            {subtitle && <div className="admin-table-shell__subtitle">{subtitle}</div>}
          </div>
          {!loading && (
            <div className="admin-table-shell__count">
              <strong>{visibleCount}</strong>
              <span>{pluralize(visibleCount, entityLabel)}</span>
            </div>
          )}
        </div>
      )}

      <div className="admin-table-scroll">
        <table
          className={`admin-table ${stickyHeader ? 'admin-table--sticky' : ''}`}
          style={{ minWidth }}
        >
          <thead>
            <tr>
              {columns.map((column) => {
                const isActive = sortKey === column.key;
                return (
                  <th
                    key={column.key || column.label}
                    className={[
                      column.align === 'right' ? 'admin-table__th--right' : '',
                      column.align === 'center' ? 'admin-table__th--center' : '',
                      column.sortable ? 'admin-table__th--sortable' : '',
                      isActive ? 'admin-table__th--sorted' : '',
                    ].filter(Boolean).join(' ')}
                    style={column.width ? { width: column.width } : undefined}
                    onClick={() => handleSort(column)}
                  >
                    <span className="admin-table__th-inner">
                      {column.label}
                      {column.sortable && (
                        <i
                          className={`fas fa-arrow-${isActive && sortDir === 'desc' ? 'down' : 'up'} admin-table__sort-icon ${isActive ? 'is-active' : ''}`}
                        />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <TableLoading message={loadingMessage} />
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <DefaultEmpty
                    icon={emptyIcon}
                    title={emptyTitle}
                    message={emptyMessage}
                  />
                  {emptyAction}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr key={row[rowKey] ?? index}>
                  {columns.map((column) => (
                    <td
                      key={`${row[rowKey] ?? index}-${column.key || column.label}`}
                      className={[
                        column.align === 'right' ? 'admin-table__td--right' : '',
                        column.align === 'center' ? 'admin-table__td--center' : '',
                        column.className || '',
                      ].filter(Boolean).join(' ')}
                    >
                      {column.render
                        ? column.render(row, index)
                        : (column.key ? row[column.key] : null)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && sortedData.length > 0 && (
        <div className="admin-table-footer">
          <span>
            Showing <strong>{visibleCount}</strong> {pluralize(visibleCount, entityLabel)}
            {isFiltered && (
              <> of <strong>{total}</strong> total</>
            )}
          </span>
          {sortKey && (
            <span className="admin-table-footer__sort">
              Sorted by {columns.find((col) => col.key === sortKey)?.label} ({sortDir})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
