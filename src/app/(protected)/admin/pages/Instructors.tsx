'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
import { Eye, ChevronDown, ChevronUp, X } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styles from '../styles/Instructors.module.scss';
import { ALL_USERS_API } from '@/utils/constants/api';

interface Course {
  _id: string;
  title: string;
}

interface Student {
  name: string;
  email: string;
  courses: string[];
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  courses: Course[];
  students: Student[];
}

interface RootState {
  darkMode: {
    isDarkMode: boolean;
  };
}

const Instructors: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [expandedCourses, setExpandedCourses] = useState<{ [key: number]: boolean }>({});
  const [totalRows, setTotalRows] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);



  const columns = useMemo<ColumnDef<Instructor>[]>(
    () => [
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
        header: 'Created Courses',
        cell: (info) => {
          const courses = info.getValue() as Course[];
          return (
            <div className={styles.coursesList}>
              {courses.map((course, index) => (
                <div key={index} className={styles.courseItem}>
                  • {course?.title || 'Untitled Course'}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const instructor = info.row.original;
          return (
            <button
              className={styles.viewButton}
              onClick={() => setSelectedInstructor(instructor)}
            >
              <Eye className={styles.icon} />
              View Details
            </button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: instructors,
    columns,
    pageCount: Math.ceil(totalRows / pageSize),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  useEffect(() => {
    const getAllInstructors = async () => {
      try {
        setLoading(true);

        const page = pageIndex + 1; // backend is 1-based
        const limit = pageSize;

        const sort = sorting[0];
        const sortField = sort?.id || 'name';
        const sortOrder = sort?.desc ? 'desc' : 'asc';

        const response = await axios.get(ALL_USERS_API, {
          params: {
            role: 'instructor',
            page,
            limit,
            search: searchValue,
            sortField,
            sortOrder,
          },
        });

        console.log('API Response:', response.data);

        if (!response?.data?.users) {
          console.error('No users data received');
          return;
        }

        const transformedData: Instructor[] = response.data.users.map(
          (instructor: any) => ({
            id: instructor._id,
            name: instructor.name || 'N/A',
            email: instructor.email || 'N/A',
            phone: instructor.phone || 'N/A',
            active: Boolean(instructor.active),
            courses: Array.isArray(instructor.courses) ? instructor.courses : [],
            students: instructor.students || [],
          })
        );

        setInstructors(transformedData);
        setTotalRows(response.data.pagination?.total || 0);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        setLoading(false);
      }
    };

    getAllInstructors();
  }, [pageIndex, pageSize, sorting, searchValue]);

  const toggleCourse = (index: number) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setPageIndex(0); // Reset to first page on search
  };

  return (
    <div className={`${styles.container} `}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>Instructors</h2>
          <input
            type="text"
            placeholder="Search instructors..."
            value={searchValue}
            onChange={handleSearchChange}
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
                            style={{ cursor: 'pointer' }}
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
            Page {pageIndex + 1} of {table.getPageCount()}
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
            className={styles.rowsPerPageSelect}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size} rows
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

      {selectedInstructor && (
        <div className={styles.modalOverlay} onClick={() => setSelectedInstructor(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Instructor Details: {selectedInstructor.name}
              </h3>
              <button className={styles.closeButton} onClick={() => setSelectedInstructor(null)}>
                <X />
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.detailRow}>
                <strong>Email:</strong> {selectedInstructor.email}
              </div>
              <div className={styles.detailRow}>
                <strong>Phone:</strong> {selectedInstructor.phone}
              </div>
              <div className={styles.detailRow}>
                <strong>Status:</strong>{' '}
                <span
                  className={`${styles.chip} ${
                    selectedInstructor.active ? styles.chipSuccess : styles.chipError
                  }`}
                >
                  {selectedInstructor.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h4 className={styles.sectionTitle}>Courses and Enrolled Students</h4>

              {selectedInstructor.courses.map((course, index) => {
                const enrolledStudents = selectedInstructor.students.filter((student) =>
                  student.courses.includes(course._id)
                );

                return (
                  <div key={course._id} className={styles.accordion}>
                    <div className={styles.accordionHeader} onClick={() => toggleCourse(index)}>
                      <span>
                        {course.title} ({enrolledStudents.length} students)
                      </span>
                      {expandedCourses[index] ? <ChevronUp /> : <ChevronDown />}
                    </div>

                    {expandedCourses[index] && (
                      <div className={styles.accordionContent}>
                        {enrolledStudents.length > 0 ? (
                          <ul className={styles.studentList}>
                            {enrolledStudents.map((student, studentIndex) => (
                              <li key={studentIndex} className={styles.studentItem}>
                                <div className={styles.studentName}>{student.name}</div>
                                <div className={styles.studentEmail}>{student.email}</div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className={styles.noStudents}>No students enrolled</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.closeButtonFooter} onClick={() => setSelectedInstructor(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructors;