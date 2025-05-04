import React, { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import './myTable.css';
import { IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import ApiService from '../../Service/ApiService';

export default function MyTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);

  useEffect(() => {
    if (props.tableRows) {
      setRows(props.tableRows);
    }
  }, [props.tableRows]);

  useEffect(() => {
    if (props.tableColumns) {
      setColumns(props.tableColumns);
    }
  }, [props.tableColumns]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className='my-table' sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '100%' }}>
        <Table className='table' stickyHeader aria-label="sticky table">
          <TableHead className='table-head'>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                    className='table-head-cell'
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className='table-body'>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column, columnIndex) => {
                      let value = row[column.id];
                      if (column.id === 'stt') {
                        value = page * rowsPerPage + index + 1; // Calculate row number
                      };
                      if (column.id === 'action')
                        return (
                          <TableCell key={{index}+"-"+{columnIndex}}>
                            <IconButton
                              color="default"
                              onClick={() => {
                                props.handleEditButton(row)
                              }}>
                              <Edit />
                            </IconButton>
                            <IconButton 
                              color="default"
                              onClick={() => {props.handleDeleteButton(row.id) ?? '' }}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                      );
                      return (
                        <TableCell className='table-body-cell' key={column.id} align={column.align} type={column.type} onClick={() => {props.handleClickRow(row) ?? ''}}>
                          {column.render
                            ? column.render(value)
                            : column.format
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}