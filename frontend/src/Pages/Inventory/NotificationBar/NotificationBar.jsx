import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { format } from "date-fns";

const NotificationBar = ({ addNotification }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUnreadCount(0); 
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      time: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const handleAddTestNotification = () => {
    handleAddNotification("Thông báo mới từ hệ thống");
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#243642" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Notification Bar
        </Typography>
        <IconButton
          color="inherit"
          onClick={handleNotificationClick}
          aria-controls={open ? "notification-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          id="notification-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: { width: 300 },
          }}
        >
          <MenuItem disabled>
            <Typography variant="subtitle1">Thông báo</Typography>
          </MenuItem>
          <Divider />
          {notifications.length === 0 ? (
            <MenuItem>
              <ListItemText primary="Không có thông báo nào." />
            </MenuItem>
          ) : (
            notifications.map((notification) => (
              <MenuItem key={notification.id} onClick={handleClose}>
                <ListItemText
                  primary={notification.message}
                  secondary={format(notification.time, "dd/MM/yyyy HH:mm")}
                />
              </MenuItem>
            ))
          )}
        </Menu>
      </Toolbar>
      <button onClick={handleAddTestNotification}>Thêm thông báo giả lập</button>
    </AppBar>
  );
};

export default NotificationBar;
