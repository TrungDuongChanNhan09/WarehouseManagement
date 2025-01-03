import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  AppBar,Box,Toolbar,InputBase,
  Stack,TextField,Button,List,ListItem,Switch,ListItemButton,ListItemText,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Modal,
  Fade, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../Service/ApiService";

import {CircularProgress, Alert} from "@mui/material";
import { useEffect } from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const PrimarySearchAppBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = useState("info");
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleOpen();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutDialogOpen = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogoutConfirm = () => {
    ApiService.logout();
    navigate("/login");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
    >
      <MenuItem onClick={handleMenuClose}>Thông tin người dùng</MenuItem>
      <MenuItem onClick={handleLogoutDialogOpen}>Đăng xuất</MenuItem>
    </Menu>
  );

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%", // Tăng chiều rộng Modal
    maxWidth: "1200px", // Giới hạn chiều rộng tối đa
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };
  

  const [formData, setFormData] = useState({
    gender: "",
    identification: "",
    dateOfBirth: "",
    address: "",
    email: "",
    image:"",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    let imageUrl = formData.image;
    if (selectedFile) {
      imageUrl = await uploadImage();
      if (!imageUrl) {
        alert("Failed to upload the image. Please try again.");
        setLoading(false);
        return;
      }
    }

    const updatedData = { ...formData, image: imageUrl };

    try {
      await ApiService.updateInforUser(updatedData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const [inforUser, setInforUser] = useState(null)
  
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); 
  const [currentImage, setCurrentImage] = useState(null); 

  
  
  useEffect(() => {
    if (open) {
      const loadUserData = async () => {
        setLoading(true);
        try {
          const response = await ApiService.getInforUser();
          setInforUser(response);
      
          setFormData({
            gender: response.gender || "",
            identification: response.identification || "",
            dateOfBirth: response.dateOfBirth || "",
            address: response.address || "",
            email: response.email || "",
            image: response.image || "", 
          });
          setCurrentImage(response.image || ""); 
        } catch (error) {
          console.error("Lỗi khi tải thông tin người dùng", error.message);
        } finally {
          setLoading(false);
        }
      };
      loadUserData();
    }
  }, [open]);
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Tạo URL để xem trước
    }
  };
  
  const handleImageUpload = async () => {
    if (!imageFile) {
      alert("Vui lòng chọn một ảnh để tải lên.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", imageFile);
  
    try {
      const response = await ApiService.uploadImage(formData);
      if (response.url) {
        alert("Tải ảnh thành công!");
        setFormData({ ...formData, image: response.url }); 
        setPreviewImage(null); 
      }
    } catch (err) {
      console.error("Lỗi tải ảnh:", err);
      alert("Tải ảnh thất bại.");
    }
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#fff", color: "#000", boxShadow: "none" }}
      >
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              sx={{ width: "800px" }}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            justifyContent={"space-between"}
            sx={{
              display: { xs: "none", md: "flex", width: "200px", border: "1px solid #9AA6B2", borderRadius: "0.5rem" },
            }}
          >
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" edge="end" aria-label="settings" color="inherit">
              <SettingsIcon />
            </IconButton>
            <IconButton
              sx={{marginRight:"0.4rem"}}
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
              <Box sx={{ width: "30%", borderRight: "1px solid #ddd" }}>
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
              <Box sx={{ width: "80%", padding: 2 }}>
                {selectedSection === "info" && (
                 

                  <Stack direction="column" spacing={2}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Cập nhật thông tin người dùng
                </Typography>

                {success && <Alert severity="success">Cập nhật thành công!</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <Box sx={{ textAlign: "center", marginBottom: "16px" }}>
                  <img
                    src={previewImage || currentImage} 
                    alt="User Avatar"
                    value={inforUser?.image || ""}
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #ddd",
                    }}
                  />
                </Box>

                <Button variant="outlined" component="label">
                  Tải ảnh mới
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </Button>

                <Button
                  onClick={handleImageUpload}
                  variant="contained"
                  sx={{color: "white", height:"50px", backgroundColor: "#243642"}}
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Gửi ảnh"}
                </Button>

                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <TextField
                      disabled
                      label="Tên người dùng"
                      value={inforUser?.userName || ""}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      disabled
                      label="Họ tên đầy đủ"
                      value={inforUser?.fullName || ""}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Giới tính"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="CMND/CCCD"
                      name="identification"
                      value={formData.identification}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Ngày sinh"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Địa chỉ"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{color: "white", height:"50px", backgroundColor: "#243642"}}
                >
                  {loading ? <CircularProgress size={24} /> : "Cập nhật thông tin"}
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
                    <TextField label="Mật khẩu hiện tại" type="password" fullWidth variant="outlined" />
                    <TextField label="Nhập mật khẩu mới" type="password" fullWidth variant="outlined" />
                    <Button
                      className="btn-setting"
                      sx={{ color: "white", height: "50px", backgroundColor: "#243642" }}
                      variant="contained"
                    >
                      Cập nhật mật khẩu
                    </Button>
                  </Stack>
                )}
              </Box>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutDialogClose}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Xác nhận đăng xuất</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Bạn có chắc chắn muốn đăng xuất không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutDialogClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleLogoutConfirm} color="secondary" autoFocus>
            Đăng xuất
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrimarySearchAppBar;