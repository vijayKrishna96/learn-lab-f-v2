// students.client.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Card, CardContent, Button, Avatar, Stack, TextField, Typography } from '@mui/material';
import { MessageSquare, Calendar } from 'lucide-react';
import styles from './students.module.scss';

// Types
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  profilePicture: string;
}

interface InstructorData {
  _id: string;
  name: string;
  email: string;
  expertise: string;
  headline: string;
  profilePicture?: {
    url: string;
  };
  students: Student[];
}

interface StudentsListProps {
  // no props required — dark mode comes from localStorage
}

const STATIC_INSTRUCTOR: InstructorData = {
  _id: 'instr_1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  expertise: 'Web Development',
  headline: 'Full-stack instructor',
  profilePicture: { url: '' },
  students: [
    {
      id: 's1',
      name: 'Priya Nair',
      email: 'priya.nair@example.com',
      phone: '9876543210',
      joinDate: '2025-09-12T10:00:00.000Z',
      profilePicture: '',
    },
    {
      id: 's2',
      name: 'Rahul Menon',
      email: 'rahul.m@example.com',
      phone: '9123456780',
      joinDate: '2025-10-01T14:30:00.000Z',
      profilePicture: '',
    },
    {
      id: 's3',
      name: 'Anita George',
      email: 'anita.g@example.com',
      phone: '9988776655',
      joinDate: '2025-11-05T09:20:00.000Z',
      profilePicture: '',
    },
    // add more static students as needed
  ],
};

const Page: React.FC<StudentsListProps> = () => {
  // read initial dark mode from localStorage (expecting 'true' or 'false' or undefined)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('isDarkMode');
      return v === 'true';
    } catch {
      return false;
    }
  });

  // keep listening for changes to localStorage (optional — useful if theme toggled elsewhere)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'isDarkMode') {
        setIsDarkMode(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // static students from instructor constant (can replace with any static list)
  const [students] = useState<Student[]>(STATIC_INSTRUCTOR.students);

  // DataGrid state
  const [loading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState<string>('');
  const [totalCount] = useState<number>(students.length);
  const [instructorData] = useState<InstructorData>(STATIC_INSTRUCTOR);

  // theme
  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: isDarkMode ? '#0f172a' : '#ffffff',
        paper: isDarkMode ? '#1f2937' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#f8fafc' : '#111827',
        secondary: isDarkMode ? '#cbd5e1' : '#6b7280',
      }
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#f8fafc' : '#111827',
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: isDarkMode ? '#f8fafc' : '#111827',
          }
        }
      },
      MuiToolbar: {
        styleOverrides: {
          regular: {
            color: isDarkMode ? '#f8fafc' : '#111827',
          }
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: isDarkMode ? '#f8fafc' : '#111827',
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: isDarkMode ? '#f8fafc' : '#111827',
          }
        }
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            width: "150px",
          },
        },
      },
    },
  }), [isDarkMode]);

  // simple client-side search filter
  const filteredRows = students.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.phone || '').toLowerCase().includes(q)
    );
  });

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return (paginationModel.page * paginationModel.pageSize) + rowIndex + 1;
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      sortable: true,
      filterable: true,
      renderCell: (params: GridRenderCellParams<Student>) => {
        const student = params.row;
        return (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={student.profilePicture}
              alt={params.value}
              sx={{ width: 40, height: 40 }}
            >
              {!student.profilePicture && (params.value as string).charAt(0)}
            </Avatar>
            <Stack>
              <div className={styles.studentName}>
                {params.value}
              </div>
              <div className={styles.studentPhone}>
                {student.phone !== 'N/A' ? student.phone : 'No phone'}
              </div>
            </Stack>
          </Stack>
        );
      }
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      sortable: true,
      filterable: true,
      renderCell: (params: GridRenderCellParams) => (
        <div className={styles.emailText}>
          {params.value}
        </div>
      )
    },
    {
      field: 'joinDate',
      headerName: 'Join Date',
      width: 150,
      sortable: true,
      filterable: true,
      renderCell: (params: GridRenderCellParams) => (
        <div className={styles.dateText}>
          {new Date(params.value as string).toLocaleDateString()}
        </div>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: () => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            className={styles.actionButton}
          >
            <MessageSquare size={20} />
          </Button>
          <Button
            size="small"
            variant="contained"
            className={styles.actionButtonPrimary}
          >
            <Calendar size={20} />
          </Button>
        </Stack>
      )
    }
  ];

  const dataGridSx = {
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f8fafc' : '#111827',
    border: 'none',
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: isDarkMode ? '#334155' : '#f3f4f6',
      color: isDarkMode ? '#f8fafc' : '#111827',
      borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
    },
    '& .MuiDataGrid-cell': {
      color: isDarkMode ? '#f8fafc' : '#111827',
      borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
    },
    '& .MuiDataGrid-row': {
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      '&:nth-of-type(odd)': {
        backgroundColor: isDarkMode ? '#1e293b' : '#f9fafb',
      },
      '&:hover': {
        backgroundColor: isDarkMode ? '#334155' : '#f3f4f6',
      },
    },
    '& .MuiDataGrid-footerContainer': {
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f8fafc' : '#111827',
      borderTop: `1px solid ${isDarkMode ? '#334155' : '#e5e7eb'}`,
    },
    '& .MuiDataGrid-toolbarContainer': {
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f8fafc' : '#111827',
    },
    '& .MuiDataGrid-virtualScroller': {
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    },
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    setSearch(newSearch);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  return (
    <div className={styles.container}>
      {instructorData && (
        <Card className={styles.instructorCard}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={instructorData.profilePicture?.url}
                alt={instructorData.name}
                sx={{ width: 60, height: 60 }}
              >
                {!instructorData.profilePicture?.url && instructorData.name.charAt(0)}
              </Avatar>
              <Stack>
                <div className={styles.instructorName}>
                  {instructorData.name}
                </div>
                <div className={styles.instructorDetails}>
                  {instructorData.expertise} • {instructorData.headline}
                </div>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card className={styles.tableCard}>
        <CardContent>
          <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" className={styles.tableTitle}>
                Students
              </Typography>
              <TextField
                size="small"
                placeholder="Search students..."
                value={search}
                onChange={handleSearchChange}
                sx={{ width: 300 }}
              />
            </Box>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              loading={loading}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25, 50]}
              rowCount={filteredRows.length}
              disableRowSelectionOnClick
              getRowId={(row: Student) => row.id}
              sx={dataGridSx}
              autoHeight
              slots={{
                noRowsOverlay: () => <Typography>No students found.</Typography>,
                noResultsOverlay: () => <Typography>No results found.</Typography>,
              }}
            />
          </ThemeProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
