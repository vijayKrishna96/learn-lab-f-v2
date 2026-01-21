"use client";

import React, { useEffect, useState } from "react";
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
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "../styles/student.module.scss";
import { ALL_USERS_API } from "@/utils/constants/api";

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

const Students: React.FC = () => {
  const [students, setStudentData] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const toggleExpand = (studentId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "active",
      header: "Active",
      cell: (info) => {
        const value = info.getValue() as boolean;
        return (
          <span
            className={`${styles.chip} ${value ? styles.chipSuccess : styles.chipError}`}
          >
            {value ? "Yes" : "No"}
          </span>
        );
      },
    },
    {
      accessorKey: "courses",
      header: "Enrolled Courses",
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
                • {course?.title || "Untitled Course"}
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
      if (typeof updater === "function") {
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
  });

  useEffect(() => {
    const getAllStudents = async () => {
      try {
        setLoading(true);

        const page = pageIndex + 1; // backend is 1-based
        const limit = pageSize;

        const sort = sorting[0];
        const sortField = sort?.id || "name";
        const sortOrder = sort?.desc ? "desc" : "asc";

        const response = await axios.get(ALL_USERS_API, {
          params: {
            role: "student",
            page,
            limit,
            search: searchValue,
            sortField,
            sortOrder,
          },
        });

        // console.log("Fetched students response:", response.data);

        if (!response?.data?.users) {
          console.error("No users data received");
          return;
        }

        const transformedData: Student[] = response.data.users.map(
          (student: any, index: number) => ({
            id: student._id || student.id || `student-${index}`,
            name: student.name || "N/A",
            email: student.email || "N/A",
            phone: student.phone || "N/A",
            active: Boolean(student.active),
            courses: Array.isArray(student.purchasedCourseDetails)
              ? student.purchasedCourseDetails.map((course: any) => ({
                  _id: course._id || course.id,
                  title: course.title || "Untitled Course",
                }))
              : [],
          }),
        );

        setStudentData(transformedData);
        setTotalRows(response.data.pagination?.total || 0);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllStudents();
  }, [pageIndex, pageSize, sorting, searchValue]);

  


  return (
    <div className={`${styles.container} `}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.title}>Students</h2>
          <input
            type="text"
            placeholder="Search students..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getIsSorted() === "asc" && (
                              <ChevronUp className={styles.sortIcon} />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ChevronDown className={styles.sortIcon} />
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className={styles.tbody}>
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={styles.td}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
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
    </div>
  );
};

export default Students;
