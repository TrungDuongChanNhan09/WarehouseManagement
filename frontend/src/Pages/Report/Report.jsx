import React, { useEffect, useState } from 'react'
import cloneDeep from 'lodash.clonedeep' // Import cloneDeep
import './Report.css'
import PrimarySearchAppBar from '../../Component/AppBar/AppBar.jsx'
import {
  Container,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  TextField,
  Button,
  Modal,
  Fade,
  Box,
  Snackbar,
  Alert,
  Select,
  MenuItem
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TableReport from '../../Hooks/TableReport.jsx/TableReport.jsx'
import ApiService from '../../Service/ApiService.jsx'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto'
}

// --- Prototype: Trạng thái mặc định cho báo cáo mới ---
const defaultNewReportState = {
  title: '',
  // userName: "", // Nên lấy tự động từ user đăng nhập, không cần nhập tay
  description: '',
  reportPriority: 'MEDIUM',
  createdAt: ''
}
// ---

const Report = () => {
  const [report, setReport] = useState([])
  const [reportOrStaff, setReportOrStaff] = useState([])
  const [role, setRole] = useState(localStorage.getItem('role') || '')
  const [userName, setUserName] = useState(
    localStorage.getItem('userName') || ''
  ) // Lấy userName từ localStorage
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  // Khởi tạo state form từ prototype
  const [newReportData, setNewReportData] = useState(defaultNewReportState)

  const fetchReport = async () => {
    try {
      const response = await ApiService.getAllReport()
      setReport(response)
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu các báo cáo (Admin):', error.message)
    }
  }
  const fetchReportOrStaff = async () => {
    try {
      const response = await ApiService.getAllReportOrStaff()
      setReportOrStaff(response)
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu các báo cáo (Staff):', error.message)
    }
  }

  // --- Xử lý Modal Add ---
  const handleOpenAddModal = () => {
    // Clone prototype để reset form mỗi khi mở
    setNewReportData(cloneDeep(defaultNewReportState))
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
    // Không cần reset state ở đây nữa vì đã reset khi mở
  }

  // Cập nhật state form khi input thay đổi
  const handleFormChange = event => {
    const { name, value } = event.target
    setNewReportData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleAddNewReport = async () => {
    try {
      const dataToSend = {
        ...newReportData,
        userName: userName,
        createdAt: new Date().toISOString()
      }

      const response = await ApiService.addReport(dataToSend)

      if (response) {
        // Cập nhật state local (tùy thuộc vào user role)
        if (role === 'ROLE_ADMIN') {
          setReport(prev => [...prev, response])
        }
        if (role === 'ROLE_STAFF') {
          setReportOrStaff(prev => [...prev, response])
        }
        fetchReport() // Fetch lại cả 2 để đảm bảo đồng bộ
        fetchReportOrStaff()

        setSnackbarMessage('Thêm báo cáo mới thành công!')
        setSnackbarSeverity('success')
        setOpenSnackbar(true)
        handleCloseAddModal() // Đóng modal sau khi thành công
      } else {
        throw new Error('Không nhận được phản hồi hợp lệ từ server')
      }
    } catch (error) {
      console.error('Lỗi khi thêm báo cáo:', error)
      setSnackbarMessage(
        `Lỗi khi thêm báo cáo: ${error.message || 'Lỗi không xác định'}`
      )
      setSnackbarSeverity('error')
      setOpenSnackbar(true)
    }
  }

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchReport()
    fetchReportOrStaff()
  }, [])

  return (
    <Container maxWidth='xl' className='Report'>
      <PrimarySearchAppBar />
      <Stack
        className='shelf-bar'
        sx={{
          backgroundColor: '#E2F1E7',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginTop: '1rem'
        }}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '20px',
              paddingLeft: '20px',
              width: 'auto'
            }}
            variant='p'
          >
            Quản lý báo cáo
          </Typography>

          {role === 'ROLE_STAFF' && (
            <Button
              sx={{
                backgroundColor: '#243642',
                width: 'auto',
                color: 'white',
                ':hover': {
                  backgroundColor: '#1A2B36'
                }
              }}
              variant='contained'
              onClick={handleOpenAddModal}
              startIcon={<AddIcon />}
            >
              Tạo báo cáo
            </Button>
          )}
        </Stack>
      </Stack>

      {role === 'ROLE_ADMIN' && <TableReport valueReport={report} />}
      {role === 'ROLE_STAFF' && <TableReport valueReport={reportOrStaff} />}

      <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
        <Fade in={isAddModalOpen}>
          <Box sx={style}>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '20px',
                marginBottom: '1rem',
                textAlign: 'center'
              }}
              variant='h6'
            >
              Tạo báo cáo mới
            </Typography>
            {/* Sử dụng state newReportData và hàm handleFormChange */}
            <Stack spacing={2}>
              <TextField
                required
                label='Tên báo cáo'
                name='title'
                value={newReportData.title}
                onChange={handleFormChange}
              />
              <TextField
                required
                label='Nội dung'
                name='description'
                multiline
                rows={4}
                value={newReportData.description}
                onChange={handleFormChange}
              />
              <FormControl fullWidth required>
                {' '}
                <InputLabel id='report-priority-label'>Mức ưu tiên</InputLabel>
                <Select
                  labelId='report-priority-label'
                  id='report-priority'
                  name='reportPriority'
                  value={newReportData.reportPriority}
                  label='Mức ưu tiên'
                  onChange={handleFormChange}
                >
                  <MenuItem value='LOW'>Thấp (LOW)</MenuItem>
                  <MenuItem value='MEDIUM'>Trung bình (MEDIUM)</MenuItem>
                  <MenuItem value='HIGH'>Cao (HIGH)</MenuItem>
                </Select>
              </FormControl>
              <Button
                sx={{
                  backgroundColor: '#243642',
                  color: 'white',
                  ':hover': { backgroundColor: '#1A2B36' },
                  marginTop: '1rem'
                }}
                variant='contained'
                onClick={handleAddNewReport}
              >
                Lưu Báo Cáo
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}
export default Report
