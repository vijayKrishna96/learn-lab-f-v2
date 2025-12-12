"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Import the SCSS module
import styles from './students.module.scss';

// ---------- Types & Static Data ----------
export type Student = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  avatarUrl?: string;
};

const STATIC_STUDENTS: Student[] = [
  { id: 's1', name: 'Priya Nair', email: 'priya.nair@example.com', phone: '9876543210', joinDate: '2025-09-12T10:00:00.000Z' },
  { id: 's2', name: 'Rahul Menon', email: 'rahul.m@example.com', phone: '9123456780', joinDate: '2025-10-01T14:30:00.000Z' },
  { id: 's3', name: 'Anita George', email: 'anita.g@example.com', phone: '9988776655', joinDate: '2025-11-05T09:20:00.000Z' },
  { id: 's4', name: 'Karan Sharma', email: 'karan.sharma@example.com', phone: '9001122334', joinDate: '2025-08-21T08:00:00.000Z' },
  { id: 's5', name: 'Meera Iyer', email: 'meera.iyer@example.com', phone: '9012345678', joinDate: '2025-07-15T12:45:00.000Z' },
  { id: 's6', name: 'Vijay Krishna', email: 'vijay.krishna@example.com', phone: '9988001122', joinDate: '2025-06-11T09:00:00.000Z' },
  { id: 's7', name: 'Sana Kapoor', email: 'sana.k@example.com', phone: '9870012345', joinDate: '2025-05-02T15:30:00.000Z' },
  { id: 's8', name: 'Arjun Patel', email: 'arjun.patel@example.com', phone: '9443344556', joinDate: '2025-04-20T11:10:00.000Z' },
  { id: 's9', name: 'Leena Thomas', email: 'leena.thomas@example.com', phone: '9332211000', joinDate: '2025-03-18T10:25:00.000Z' },
  { id: 's10', name: 'Dev Malhotra', email: 'dev.m@example.com', phone: '9223344556', joinDate: '2025-02-28T13:55:00.000Z' },
];

// ---------- Component ----------
export default function StudentsTanStackTable() {
  

  const [data] = useState<Student[]>(() => STATIC_STUDENTS);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<Student>[] = useMemo(() => [
    {
      id: 'index',
      header: '#',
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination;
        return pageIndex * pageSize + row.index + 1;
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ getValue, row }) => (
        <div className={styles.studentInfo}>
          <div className={styles.avatar}>
            {String(getValue()).charAt(0)}
          </div>
          <div className={styles.studentDetails}>
            <span className={styles.studentName}>{getValue() as string}</span>
            <span className={styles.studentPhone}>{row.original.phone || 'No phone'}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => getValue() as string,
    },
    {
      accessorKey: 'joinDate',
      header: 'Join Date',
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <div className={styles.actionsCell}>
          <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>
            Message
          </button>
          <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>
            Calendar
          </button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });


  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Students</h2>
            <p className={styles.cardDescription}>Manage your enrolled students</p>
          </div>

          <div className={styles.headerActions}>
            <input
              type="text"
              placeholder="Search students..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <div className={styles.tableInfoHeader}>
            <div className={styles.tableInfoText}>{data.length} students</div>
            <div className={styles.tableInfoText}>
              Page {table.getState().pagination.pageIndex + 1}
            </div>
          </div>

          <div className={styles.tableHeaderRow}>
            {table.getHeaderGroups()[0].headers.map((header) => (
              <div
                key={header.id}
                className={styles.tableHeaderCell}
                onClick={header.column.getToggleSortingHandler()}
              >
                {header.isPlaceholder ? null : (
                  <>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className={styles.sortIcon}>
                      {header.column.getIsSorted() === 'asc' ? ' 🔼' : 
                       header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className={styles.tableBody}>
            {table.getRowModel().rows.length === 0 ? (
              <div className={styles.emptyState}>No students found.</div>
            ) : (
              table.getRowModel().rows.map((row) => (
                <div key={row.id} className={styles.tableRow}>
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id} className={styles.tableCell}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            <div>Showing</div>
            <select
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              value={table.getState().pagination.pageSize}
              className={styles.pageSizeSelect}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className={styles.paginationControls}>
            <button
              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </button>
            <span className={styles.paginationText}>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
            <button
              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}