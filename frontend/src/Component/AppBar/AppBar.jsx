import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { InputBase, Stack, TextField, Button, List, ListItem, Switch, 
  ListItemButton , ListItemText, IconButton,Typography, Badge, MenuItem,
  Menu, Modal, Fade, Backdrop, Popover} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const PrimarySearchAppBar = () =>  {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleOpen();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Thông tin người dùng</MenuItem>
      {/* <MenuItem onClick={handleMenuClose}>Đăng xuất</MenuItem> */}
    </Menu>
  );

  const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectedSection, setSelectedSection] = useState("info");




  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        sx={{ backgroundColor: '#fff', color: '#000', boxShadow: 'none' }}
      >
        <Toolbar>
          <Search >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase sx={{width: "800px"}}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box justifyContent={'space-between'} sx={{ display: { xs: 'none', md: 'flex' ,width: "200px", border: "1px solid #9AA6B2", borderRadius: "0.5rem"} }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              sx={{marginRight:"0.2rem"}}
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition  
            >
          <Fade in={open}>
        <Box sx={style}>
          <Stack direction="row" spacing={2}>
            {/* Left Navbar */}
            <Box
              sx={{
                width: "30%",
                borderRight: "1px solid #ddd",
              }}
            >
              <List>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedSection === "info"}
                    onClick={() => setSelectedSection("info")}
                  >
                    <ListItemText primary="Thông tin" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedSection === "security"}
                    onClick={() => setSelectedSection("security")}
                  >
                    <ListItemText primary="Bảo mật" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>

            {/* Right Content */}
            <Box sx={{ width: "70%", padding: 2 }}>
              {selectedSection === "info" && (
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Thông tin người dùng
                  </Typography>
                  <TextField
                    label="Họ và tên"
                    fullWidth
                    variant="outlined"
                    defaultValue="Nguyễn Văn A"
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    variant="outlined"
                    defaultValue="nguyenvana@gmail.com"
                  />
                  <TextField
                    label="Số điện thoại"
                    fullWidth
                    variant="outlined"
                    defaultValue="0123456789"
                  />
                   <Button 
                    className="btn-setting" 
                    sx={{color: "white", height:"50px", backgroundColor: "#243642"}} variant="contained">
                    Cập nhật thông tin
                  </Button>
                </Stack>
              )}
              {selectedSection === "security" && (
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Bảo mật
                  </Typography>
                  <Typography>
                    Bật xác thực hai yếu tố (2FA):
                    <Switch defaultChecked />
                  </Typography>
                  <TextField
                    label="Mật khẩu mới"
                    type="password"
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Nhập lại mật khẩu mới"
                    type="password"
                    fullWidth
                    variant="outlined"
                  />
                  
                  <Button 
                    className="btn-setting" 
                    sx={{color: "white", height:"50px", backgroundColor: "#243642"}} variant="contained">
                    Cập nhật mật khẩu
                  </Button>
                </Stack>
              )}
            </Box>
          </Stack>
        </Box>
      </Fade>
      </Modal>

     
    </Box>
  );
}

export default PrimarySearchAppBar