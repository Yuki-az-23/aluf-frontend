// src/pages/AccountPage.tsx
import { useState, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { ProfileCard } from '@/components/account/ProfileCard';
import { OrdersList, type TableRow } from '@/components/account/OrdersList';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useLang } from '@/i18n';

// ── DOM selectors confirmed by inspection ─────────────────────────────────────
const TABLE_CONTAINER = '#show_custmer_orders'; // note: Konimbo typo "custmer"
const TABLE_SELECTOR = `${TABLE_CONTAINER} table.current_customer_table`;

function getSubPage(): 'orders' | 'tickets' | 'carts' | 'edit' | 'other' {
  const path = window.location.pathname;
  if (/\/current_customer\/orders/.test(path) || /\/customer_profile/.test(path)) return 'orders';
  if (/\/current_customer\/tickets/.test(path)) return 'tickets';
  if (/\/current_customer\/carts/.test(path)) return 'carts';
  if (/\/current_customer\/edit/.test(path) || /\/customer_edit_profile/.test(path)) return 'edit';
  return 'other';
}

function scrapeTableRows(): TableRow[] {
  const table = document.querySelector<HTMLTableElement>(TABLE_SELECTOR);
  if (!table) return [];
  const rows: TableRow[] = [];
  const bodyRows = table.querySelectorAll('tbody tr');
  bodyRows.forEach(tr => {
    const cells = tr.querySelectorAll('td');
    if (cells.length < 2) return;
    const idCell = cells[0];
    const idLink = idCell.querySelector('a');
    rows.push({
      id: idCell.textContent?.trim() || '',
      idHref: idLink ? idLink.getAttribute('href') || undefined : undefined,
      date: cells[1]?.textContent?.trim() || '',
      name: cells[2]?.textContent?.trim() || '',
      status: cells[3]?.textContent?.trim() || '',
    });
  });
  return rows;
}

function scrapeCustomerName(): string | null {
  // Try to extract name from the first table row's "שם הלקוח" (customer name) column
  const rows = document.querySelectorAll<HTMLElement>(
    `${TABLE_CONTAINER} table.current_customer_table tbody tr td:nth-child(3)`,
  );
  for (const cell of Array.from(rows)) {
    const text = cell.textContent?.trim();
    if (text) return text;
  }
  return null;
}

interface AccountData {
  name: string | null;
  rows: TableRow[];
  subPage: 'orders' | 'tickets' | 'carts' | 'edit' | 'other';
}

export function AccountPage() {
  const { t } = useLang();
  const [data, setData] = useState<AccountData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const subPage = getSubPage();
      setData({
        name: scrapeCustomerName(),
        rows: subPage !== 'edit' ? scrapeTableRows() : [],
        subPage,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const subPage = getSubPage();

  const navLinks = [
    { href: '/current_customer/orders', key: 'account.nav.orders', sub: 'orders' },
    { href: '/current_customer/tickets', key: 'account.nav.tickets', sub: 'tickets' },
    { href: '/current_customer/carts', key: 'account.nav.carts', sub: 'carts' },
    { href: '/current_customer/edit', key: 'account.nav.edit', sub: 'edit' },
  ] as const;

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-3xl font-black text-text-main mb-6">{t('account.title')}</h1>

        {/* Navigation tabs */}
        <div className="flex gap-1 mb-8 border-b border-border-light">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                subPage === link.sub
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: profile card */}
          <div className="lg:col-span-1">
            {data ? (
              <ProfileCard name={data.name} />
            ) : (
              <div className="bg-card-bg border border-border-light rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-border-light rounded w-1/2 mb-3" />
                <div className="h-10 bg-border-light rounded-full w-10" />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {!data ? (
              <div className="flex items-center justify-center h-48">
                <Spinner size="lg" />
              </div>
            ) : subPage === 'edit' ? (
              <div className="bg-card-bg border border-border-light rounded-2xl p-6">
                <h2 className="font-bold text-lg text-text-main mb-4">{t('account.nav.edit')}</h2>
                <EmptyState
                  icon="lock"
                  title={t('account.nav.edit')}
                  description={t('account.profile.edit')}
                />
                <div className="mt-4 text-center">
                  <a
                    href="/current_customer/edit"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition"
                  >
                    {t('account.nav.edit')} →
                  </a>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-bold text-lg text-text-main mb-4">
                  {subPage === 'orders' && t('account.orders.title')}
                  {subPage === 'tickets' && t('account.tickets.title')}
                  {subPage === 'carts' && t('account.carts.title')}
                </h2>
                <OrdersList
                  rows={data.rows}
                  emptyKey={
                    subPage === 'orders' ? 'account.orders.empty' :
                    subPage === 'tickets' ? 'account.tickets.empty' :
                    'account.carts.empty'
                  }
                  idLabel={
                    subPage === 'orders' ? t('account.orders.id') :
                    subPage === 'tickets' ? t('account.orders.id') :
                    t('account.orders.id')
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
