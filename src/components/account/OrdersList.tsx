// src/components/account/OrdersList.tsx
import { useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { useLang } from '@/i18n';

export interface TableRow {
  id: string;
  idHref?: string;
  date: string;
  name: string;
  status: string;
}

interface OrdersListProps {
  rows: TableRow[];
  emptyKey: string;
  idLabel: string;
}

export function OrdersList({ rows, emptyKey, idLabel }: OrdersListProps) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  if (rows.length === 0) {
    return <EmptyState icon="receipt_long" title={t(emptyKey)} />;
  }

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border-light">
      <table className="w-full text-sm">
        <thead className="bg-card-bg border-b border-border-light">
          <tr>
            <th className="text-start px-4 py-3 font-bold text-text-muted text-xs uppercase tracking-wide">{idLabel}</th>
            <th className="text-start px-4 py-3 font-bold text-text-muted text-xs uppercase tracking-wide">{t('account.orders.date')}</th>
            <th className="text-start px-4 py-3 font-bold text-text-muted text-xs uppercase tracking-wide">{t('account.profile.name')}</th>
            <th className="text-start px-4 py-3 font-bold text-text-muted text-xs uppercase tracking-wide">{t('account.orders.status')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {rows.map((row, i) => (
            <tr key={row.id || i} className="hover:bg-card-bg/50 transition-colors">
              <td className="px-4 py-3 font-medium text-text-main">
                {row.idHref
                  ? <a href={row.idHref} className="text-primary hover:underline">{row.id}</a>
                  : row.id}
              </td>
              <td className="px-4 py-3 text-text-muted">{row.date}</td>
              <td className="px-4 py-3 text-text-main">{row.name}</td>
              <td className="px-4 py-3">
                {row.status && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    {row.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
