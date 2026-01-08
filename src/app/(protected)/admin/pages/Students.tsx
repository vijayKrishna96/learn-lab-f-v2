'use client';

import React, { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styles from '../styles/student.module.scss';

interface Course {
  _id: string;
  title: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  courses: Course[];
}

interface RootState {
  darkMode: {
    isDarkMode: boolean;
  };
}

const Students: React.FC = () => {
  const [students, setStudentData] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const isDarkMode = useSelector((state: RootState) => state.darkMode.isDarkMode);
  const ALL_USERS_API = '/api/users'; // Update with your actual API endpoint

  const toggleExpand = (studentId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  useEffect(() => {
  const getAllStudents = async () => {
    try {
      setLoading(true);

      const page = table.getState().pagination.pageIndex + 1; // backend is 1-based
      const limit = table.getState().pagination.pageSize;

      const sort = table.getState().sorting[0];
      const sortField = sort?.id || 'name';
      const sortOrder = sort?.desc ? 'desc' : 'asc';

      const response = await axios.get(ALL_USERS_API, {
        params: {
          role: 'student',
          page,
          limit,
          search: searchValue, // from input/state
          sortField,
          sortOrder,
        },
      });

      if (!response?.data?.users) {
        console.error('No users data received');
        return;
      }

      const transformedData: Student[] = response.data.users.map(
        (student: any, index: number) => ({
          id: student._id || student.id || `student-${index}`,
          name: student.name || 'N/A',
          email: student.email || 'N/A',
          phone: student.phone || 'N/A',
          active: Boolean(student.active),
          courses: Array.isArray(student.courses) ? student.courses : [],
        })
      );

      setStudentData(transformedData);

      // Optional if you maintain total count
      setTotalRows(response.data.pagination?.total || 0);

    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  getAllStudents();
}, [
  table.getState().pagination.pageIndex,
  table.getState().pagination.pageSize,
  table.getState().sorting,
  searchValue,
]);


  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'active',
      header: 'Active',
      cell: (info) => {
        const value = info.getValue() as boolean;
        return (
          <span className={`${styles.chip} ${value ? styles.chipSuccess : styles.chipError}`}>
            {value ? 'Yes' : 'No'}
          </span>
        );
      },
    },
    {
      accessorKey: 'courses',
      header: 'Enrolled Courses',
      cell: (info) => {
        const courses = info.getValue() as Course[];
        const student = info.row.original;
        const studentId = student.id;
        const isExpanded = expandedRows[studentId];
        const displayCourses = isExpanded ? courses : courses.slice(0, 2);
        const hasMore = courses.length > 2;

        return (
          <div className={styles.coursesList}>
            {displayCourses.map((course, index) => (
              <div key={index} className={styles.courseItem}>
                • {course?.title || 'Untitled Course'}
              </div>
            ))}
            {hasMore && (
              <button
                className={styles.expandButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleExpand(studentId);
                }}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className={styles.expandIcon} />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className={styles.expandIcon} />
                    Show {courses.length - 2} More
                  </>
                )}
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: students,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>Students</h2>
          <input
            type="text"
            placeholder="Search students..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.tableWrapper}>
          {loading ? (
            <div className={styles.loading}>Loading data...</div>
          ) : (
            <table className={styles.table}>
              <thead className={styles.thead}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className={styles.th}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={styles.headerContent}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === 'asc' && <ChevronUp className={styles.sortIcon} />}
                            {header.column.getIsSorted() === 'desc' && <ChevronDown className={styles.sortIcon} />}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className={styles.tbody}>
                {table.getRowModel().rows.map((row, index) => (
                  <tr key={row.id} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={styles.td}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.pagination}>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={styles.paginationButton}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className={styles.rowsPerPageSelect}
          >
            {[5, 10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} rows
              </option>
            ))}
          </select>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Students;