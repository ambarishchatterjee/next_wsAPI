import { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
  Avatar,
} from "@mui/material";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import ProfileModal from "@/pages/cms/profiledetails/profiledetails";
import { useRouter } from "next/router";
import { profileDetailsQuery } from "@/customHooks/query/cms.query.createhooks";
import toast from "react-hot-toast";
import { useUserStore } from "@/toolkit/store/store";
import { useCookies } from "react-cookie";

//const pro_pic = JSON.parse(localStorage.getItem('user') || '{}')



const Header: React.FC = () => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productMenuAnchor, setProductMenuAnchor] = useState<null | HTMLElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { token, setToken, user, setUser } = useUserStore();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [pic, setPic] = useState<object | any>()

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const {
    data,
    isPending: isPendingCategories,
    isError: isErrorCategories,
  } = profileDetailsQuery();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const pro_pic = localStorage.getItem('user');
      if (pro_pic) {
        try {
          const parsedData: any = JSON.parse(pro_pic);
          //console.log(parsedData);
          setPic(parsedData)
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    }
    //console.log(pic);

  }, [token])



  // Sync Zustand state with cookies on component mount
  useEffect(() => {
    if (cookies.token) {
      setToken(cookies.token);
    } else {
      setToken("");
    }
  }, [cookies.token, setToken, setUser]);

  // Logout function
  const handleLogout = () => {
    removeCookie("token", { path: "/" });
    setToken("");

    toast.success("Logout Successfully");
    router.push("/auth/login");
    localStorage.removeItem("user");
    localStorage.removeItem("token")
  };
  // Login function
  const handleLogin = () => {
    router.push("/auth/login");
  };




  const productSubItems = [
    { name: "Product Create", path: "/cms/create" },
    { name: "Product List", path: "/cms/list" },
    { name: "Product Update", path: "/cms/list/[slug].tsx" },
  ];

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsDrawerOpen(open);
    };

  const handleProductMenuToggle = () => {
    setIsProductMenuOpen((prevOpen) => !prevOpen);
  };

  const drawerList = (
    <Box
      sx={{
        width: "100vw",
        paddingTop: "10px",
        paddingBottom: "10px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItemButton onClick={handleProductMenuToggle}>
          <ListItemText primary="Product" />
          {isProductMenuOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isProductMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {productSubItems.map((item) => (
              <ListItem key={item.name} sx={{ pl: 4 }}>
                <Link href={item.path} passHref>
                  <ListItemText primary={item.name} />
                </Link>
              </ListItem>
            ))}
          </List>
        </Collapse>
        <ListItem>
          {token ? (
            <>
              <Typography variant="body1" color="initial">Hello, {data?.first_name}</Typography>
              <Button onClick={handleLogout} style={{ textDecoration: "none", color: "inherit" }}>
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={handleLogin} style={{ textDecoration: "none", color: "inherit" }}>
              Sign In
            </Button>
          )}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: "#2196f3" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
          >
            <ProductionQuantityLimitsIcon />
          </IconButton>

          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
          >
            My Beauty Product App
          </Typography>

          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <Button
              color="inherit"
              onMouseEnter={(e) => setProductMenuAnchor(e.currentTarget)}
              aria-controls="product-menu"
              aria-haspopup="true"
            >
              Product
            </Button>
            <Menu
              id="product-menu"
              anchorEl={productMenuAnchor}
              open={Boolean(productMenuAnchor)}
              onClose={() => setProductMenuAnchor(null)}
              MenuListProps={{ onMouseLeave: () => setProductMenuAnchor(null) }}
              sx={{ mt: 1 }}
            >
              {productSubItems.map((item) => (
                <MenuItem
                  key={item.name}
                  onClick={() => setProductMenuAnchor(null)}
                >
                  <Link href={item.path} passHref>
                    {item.name}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
            {token ? (
              <>
                <Typography variant="body1" color="#fff">Hello, {pic?.first_name}</Typography>
                <Button onClick={handleLogout} color="inherit">
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={handleLogin} color="inherit">
                Sign In
              </Button>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {token && data && (
              <Avatar
                src={`https://wtsacademy.dedicateddevelopers.us/uploads/user/profile_pic/${pic.profile_pic}`}
                sx={{ width: 40, height: 40, cursor: "pointer" }}
                onClick={openModal}
              />
            )}

            {/* Profile Modal */}
            {isModalOpen && (
              <ProfileModal isOpen={isModalOpen} onClose={closeModal} />
            )}
          </Box>

          {/* <Link href="/profile" style={{ textDecoration: "none", color: "inherit" }}>
            {profilePic ? <Avatar src={profilePic} sx={{ width: 40, height: 40 }} /> : <Avatar sx={{ bgcolor: "primary.main" }}>?</Avatar>}
          </Link> */}

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={isDrawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  width: "100vw",
                  margin: 0,
                  padding: 0,
                  overflowX: "hidden",
                },
              }}
            >
              {drawerList}
            </Drawer>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;



