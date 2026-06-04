import ArrowIcon from "../../assets/icons/Down.svg";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import CalendarIcon from "../../assets/icons/calendar.svg";
import UserAvatarIcon from "../../assets/icons/Ellipse_12.svg";
import { PATHOLOGY_MENU } from "../../config/sidebar.menu";
import { useDispatch, useSelector } from "react-redux";
import { fetchClinics, selectClinics, fetchFirstClinic, fetchClinic, selectClinic } from "../../store/clinicSlice";
import { AppDispatch } from "../../store";

type HeaderUser = {
  first_name: string;
  last_name: string;
  designation_label: string;
};

type ActiveMenu = {
  parent: string | null;
  child: string;
};

const getActiveMenuLabel = (pathname: string): ActiveMenu => {
  for (const item of PATHOLOGY_MENU) {
    if (item.path === pathname) {
      return { parent: null, child: item.label };
    }

    const activeSubMenu = item.subMenu?.find(
      (subItem) => subItem.path === pathname,
    );

    if (activeSubMenu) {
      return {
        parent: item.label,
        child: activeSubMenu.label,
      };
    }
  }

  return { parent: null, child: "Orders" };
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user: HeaderUser = {
    first_name: "Kate",
    last_name: "Russell",
    designation_label: "Receptionist",
  };
  const clinic = useSelector(selectClinic); 
  const clinics = useSelector(selectClinics);
  const clinicName = clinic?.clinic_name ?? "Select Clinic";  
  const activeBreadcrumb = getActiveMenuLabel(location.pathname);
  const [clinicAnchor, setClinicAnchor] = useState<null | HTMLElement>(null);

  const handleClinicOpen = (e: React.MouseEvent<HTMLElement>) =>
    setClinicAnchor(e.currentTarget);

  const handleClinicClose = () => setClinicAnchor(null);
  // const clinic = useSelector(selectClinic);
  // const clinicName = clinic?.name || "";

  /* ================= ICON MENU STATE ================= */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<"calendar" | null>(null);

  const handleIconClick = (
    event: React.MouseEvent<HTMLElement>,
    type: "calendar",
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveMenu(type);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenu(null);
  };

  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setUserAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => setUserAnchorEl(null);
  const handleLogout = () => {
    handleUserMenuClose();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    dispatch(fetchFirstClinic());
    dispatch(fetchClinics());
  }, [dispatch]);

  const iconMenus = [{ icon: CalendarIcon, type: "calendar" }] as const;

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "transparent",
        borderRadius: 0,
        boxShadow: "none",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 2 }}>
        {/* LEFT: Breadcrumbs */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Typography sx={{ color: "#666" }}>Pathology</Typography>

          {/* ALWAYS show arrow after Pathology */}
          <Box component="img" src={ArrowIcon} sx={{ width: 12, height: 12 }} />

          {/* Show parent if exists */}
          {activeBreadcrumb.parent && (
            <>
              <Typography sx={{ color: "#666" }}>
                {activeBreadcrumb.parent}
              </Typography>

              <Box
                component="img"
                src={ArrowIcon}
                sx={{ width: 12, height: 12 }}
              />
            </>
          )}

          {/* Always show child */}
          <Typography sx={{ color: "#1f1f1f", fontSize: 18, fontWeight: 700 }}>
            {activeBreadcrumb.child}
          </Typography>
        </Box>

        {/* RIGHT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>
            <Box
              onClick={handleClinicOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                background: "#f3f4f6",
                px: 2,
                py: 1,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2">
                Clinic: <b>{clinicName}</b>
              </Typography>
              <ArrowDropDownIcon />
            </Box>

            <Menu
              anchorEl={clinicAnchor}
              open={Boolean(clinicAnchor)}
              onClose={handleClinicClose}
            >
              {clinics?.map((clinic) => (
                <MenuItem key={clinic.id} onClick={() => {
                  dispatch(fetchClinic(clinic.id));
                  handleClinicClose();
                }}>
                  {clinic.clinic_name}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {iconMenus.map(({ icon, type }) => (
            <IconButton
              key={type}
              onClick={(e) => handleIconClick(e, type)}
              sx={{
                width: 48,
                height: 48,
                backgroundColor: "#fff",
                borderRadius: 1,
              }}
            >
              <Box component="img" src={icon} width={24} />
            </IconButton>
          ))}

          {/* USER */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src={UserAvatarIcon}
              sx={{ width: 36, height: 36, borderRadius: "10px" }}
            />
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                fontWeight={600}
              >{`${user.first_name} ${user.last_name}`}</Typography>

              <Typography fontSize={12} color="#6b7280">
                {user.designation_label}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleUserMenuOpen}>
              <ArrowDropDownIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>

      {/* ICON MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {activeMenu === "calendar" && (
          <MenuItem disabled>No events for today</MenuItem>
        )}
      </Menu>

      {/* USER MENU */}
      <Menu
        anchorEl={userAnchorEl}
        open={Boolean(userAnchorEl)}
        onClose={handleUserMenuClose}
      >
        <MenuItem>My Account</MenuItem>
        <MenuItem>Change Password</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: "red", fontWeight: 600 }}>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
