import React, { useEffect, useState } from 'react' // Đã thêm useState
import cloneDeep from 'lodash.clonedeep' // Import cloneDeep từ lodash
import './Supplier.css'
import {
  alpha,
  Box,
  Button,
  Container,
  Fade,
  InputAdornment,
  InputBase,
  Modal,
  Stack,
  styled,
  TextField,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import MyTable from '../../Component/MyTable' // Giả sử MyTable nhận props như cũ
import ApiService from '../../Service/ApiService'

// --- Các styled components (StyledInputBase, Search) giữ nguyên ---
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  width: '100%',
  backgroundColor: 'white',
  '& .MuiInputBase-input': {
    padding: '10px',
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12vw',
      '&:focus': {
        width: '20vw'
      }
    }
  }
}))

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  margin: 5,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))
// ---

// --- Cấu trúc cột cho bảng giữ nguyên ---
const columns = [
  { id: 'stt', label: 'STT', minWidth: 50, align: 'center' },
  {
    id: 'nameSupplier',
    label: 'Tên nhà cung cấp',
    minWidth: 100,
    align: 'left'
  },
  { id: 'address', label: 'Địa chỉ', minWidth: 100, align: 'left' },
  { id: 'phoneNumber', label: 'Số điện thoại', minWidth: 100, align: 'center' },
  { id: 'email', label: 'Email', minWidth: 100, align: 'center' },
  { id: 'action', label: '', align: 'center' }
]

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 5
}

// --- Prototype (Trạng thái mặc định) cho form thêm nhà cung cấp ---
const defaultSupplierState = {
  nameSupplier: '',
  address: '',
  phoneNumber: '',
  email: ''
}

export default function Supplier () {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false) // State cho Modal Add
  const [openEdit, setOpenEdit] = useState(false) // State cho Modal Edit
  const [rows, setRows] = useState([]) // State cho dữ liệu bảng
  const [selectedRowId, setSelectedRowId] = useState(null) // Chỉ lưu ID của dòng được chọn để sửa
  const [formData, setFormData] = useState(defaultSupplierState) // State chung cho dữ liệu form Add/Edit

  // Hàm xử lý chung cho việc thay đổi input trong form (controlled components)
  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))
  }

  // Hàm gọi API để lấy danh sách nhà cung cấp
  const fetchRows = async () => {
    try {
      const response = await ApiService.getAllSupplier()
      const rowsWithStt = response.map((row, index) => ({
        ...row,
        stt: index + 1
      }))
      setRows(rowsWithStt)
    } catch (error) {
      console.error('Lỗi khi tải thông tin nhà cung cấp:', error.message)
    }
  }

  // Xử lý mở Modal Add
  const handleOpen = () => {
    setFormData(cloneDeep(defaultSupplierState)) // Clone prototype để reset form
    setOpen(true)
  }

  // Xử lý đóng Modal Add
  const handleClose = () => setOpen(false)

  // Xử lý mở Modal Edit
  const handleEditButton = row => {
    setSelectedRowId(row.id)
    setFormData(cloneDeep(row)) // Clone dữ liệu của dòng được chọn vào form state
    setOpenEdit(true)
  }

  // Xử lý đóng Modal Edit
  const handleCloseEdit = () => {
    setOpenEdit(false)
    setSelectedRowId(null)
  }

  // Xử lý submit form Add
  const handleAddSupplier = async () => {
    try {
      const respond = await ApiService.addSupplier(formData)
      if (respond && (respond.status === 201 || respond.status === 200)) {
        handleClose()
        fetchRows()
      } else {
        console.error('Thêm nhà cung cấp thất bại:', respond)
      }
    } catch (error) {
      console.error('Lỗi khi thêm nhà cung cấp:', error)
    }
  }

  // Xử lý submit form Edit
  const handleUpdateSupplier = async () => {
    if (!selectedRowId) return
    try {
      const dataToSend = { ...formData }
      const respond = await ApiService.updateSupplier(selectedRowId, dataToSend)
      if (respond && respond.status === 200) {
        handleCloseEdit()
        fetchRows()
      } else {
        console.error('Cập nhật nhà cung cấp thất bại:', respond)
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật nhà cung cấp:', error)
    }
  }

  // Xử lý nút Delete
  const handleDeleteButton = async id => {
    if (window.confirm(`Bạn có chắc muốn xóa nhà cung cấp với ID: ${id}?`)) {
      try {
        await ApiService.deleteSupplier(id)
        setRows(prevRows => prevRows.filter(row => row.id !== id))
      } catch (error) {
        console.error('Lỗi khi xóa nhà cung cấp:', error)
      }
    }
  }

  // Lọc dữ liệu dựa trên thanh tìm kiếm (client-side)
  const filteredRows = rows.filter(
    row =>
      row.nameSupplier &&
      row.nameSupplier.toLowerCase().includes(search.toLowerCase())
  )

  // Fetch dữ liệu lần đầu khi component mount
  useEffect(() => {
    fetchRows()
  }, [])

  return (
    <Container
      maxWidth='xl'
      className='Supplier'
      sx={{
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Stack
        className='Supplier-bar'
        sx={{
          backgroundColor: '#ffffff',
          padding: '1rem',
          borderRadius: '0.5rem'
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
              fontSize: '25px',
              paddingLeft: '10px',
              width: 'auto'
            }}
            variant='p'
          >
            Quản lý nhà cung cấp
          </Typography>
          <Stack direction={'row'} alignItems={'center'}>
            <Stack
              className='search-bar'
              direction={'row'}
              alignItems={'center'}
              sx={{ marginRight: '0.5rem' }}
            >
              <Search>
                <StyledInputBase
                  sx={{ padding: '0rem' }}
                  placeholder='Tìm theo tên NCC...'
                  startAdornment={
                    <InputAdornment
                      className='input-adornment'
                      position='start'
                    >
                      <SearchIcon />
                    </InputAdornment>
                  }
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </Stack>
            <Stack
              className='btn-add-inventory-bar'
              direction={'row'}
              alignItems={'center'}
            >
              <Button
                onClick={handleOpen}
                className='btn-setting'
                sx={{
                  color: 'white',
                  height: '55px',
                  backgroundColor: '#243642',
                  '&:hover': { backgroundColor: '#1c2b35' }
                }}
                variant='contained'
              >
                <AddIcon sx={{ color: 'white' }} />
                Thêm nhà cung cấp
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <MyTable
          tableColumns={columns}
          tableRows={filteredRows}
          handleDeleteButton={handleDeleteButton}
          handleEditButton={handleEditButton}
        />
      </Stack>

      <Modal
        aria-labelledby='transition-modal-add-title'
        aria-describedby='transition-modal-add-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <Stack
              className='template-add-iventory'
              direction={'column'}
              alignItems={'center'}
            >
              <Typography
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  width: '100%'
                }}
                variant='p'
              >
                Thêm nhà cung cấp
              </Typography>
              <Stack
                sx={{ marginTop: '1rem', marginBottom: '1rem' }}
                className='body-infor'
                flexWrap='wrap'
                direction={'row'}
                alignItems={'center'}
              >
                <TextField
                  sx={{ margin: '1%', width: '100%' }}
                  value={formData.nameSupplier}
                  onChange={handleChange}
                  name='nameSupplier'
                  label='Tên nhà cung cấp'
                  variant='outlined'
                  required
                />
                <TextField
                  sx={{ margin: '1%', width: '48%' }}
                  value={formData.email}
                  onChange={handleChange}
                  name='email'
                  label='Email'
                  variant='outlined'
                  type='email'
                />
                <TextField
                  sx={{ margin: '1%', width: '48%' }}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  name='phoneNumber'
                  label='Số điện thoại'
                  variant='outlined'
                />
                <TextField
                  sx={{ margin: '1%', width: '100%' }}
                  value={formData.address}
                  onChange={handleChange}
                  name='address'
                  label='Địa chỉ'
                  variant='outlined'
                />
              </Stack>
              <Button
                className='btn-setting'
                onClick={handleAddSupplier}
                sx={{
                  color: 'white',
                  height: '50px',
                  backgroundColor: '#243642',
                  '&:hover': { backgroundColor: '#1c2b35' }
                }}
                variant='contained'
              >
                Thêm nhà cung cấp
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby='transition-modal-edit-title'
        aria-describedby='transition-modal-edit-description'
        open={openEdit}
        onClose={handleCloseEdit}
        closeAfterTransition
      >
        <Fade in={openEdit}>
          <Box sx={style}>
            <Stack
              className='template-add-iventory'
              direction={'column'}
              alignItems={'center'}
            >
              <Typography
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  width: '100%'
                }}
                variant='p'
              >
                Cập nhật nhà cung cấp
              </Typography>
              <Stack
                sx={{ marginTop: '1rem', marginBottom: '1rem' }}
                className='body-infor'
                flexWrap='wrap'
                direction={'row'}
                alignItems={'center'}
              >
                <TextField
                  sx={{ margin: '1%', width: '100%' }}
                  value={formData?.nameSupplier || ''}
                  onChange={handleChange}
                  name='nameSupplier'
                  label='Tên nhà cung cấp'
                  variant='outlined'
                  required
                />
                <TextField
                  sx={{ margin: '1%', width: '48%' }}
                  value={formData?.email || ''}
                  onChange={handleChange}
                  name='email'
                  label='Email'
                  variant='outlined'
                  type='email'
                />
                <TextField
                  sx={{ margin: '1%', width: '48%' }}
                  value={formData?.phoneNumber || ''}
                  onChange={handleChange}
                  name='phoneNumber'
                  label='Số điện thoại'
                  variant='outlined'
                />
                <TextField
                  sx={{ margin: '1%', width: '100%' }}
                  value={formData?.address || ''}
                  onChange={handleChange}
                  name='address'
                  label='Địa chỉ'
                  variant='outlined'
                />
              </Stack>
              <Button
                className='btn-setting'
                onClick={handleUpdateSupplier}
                sx={{
                  color: 'white',
                  height: '50px',
                  backgroundColor: '#243642',
                  '&:hover': { backgroundColor: '#1c2b35' }
                }}
                variant='contained'
              >
                Cập nhật
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Container>
  )
}
