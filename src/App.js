import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { Input, Item } from "./components";
import { processImages } from "./utils.js";
import { Typography } from "@mui/material";
import { height } from "./constants";

const drawerWidth = 240;

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [deviation, setDeviation] = React.useState("");
  const [img1Ready, setImg1Ready] = React.useState(false);
  const [img2Ready, setImg2Ready] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onClickProcessImage = () => {
    const deviation = processImages();
    setDeviation(deviation);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Divider />
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {img1Ready && img2Ready && (
            <Button
              variant="contained"
              color="success"
              onClick={onClickProcessImage}
            >
              Process
            </Button>
          )}

          {deviation && (
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              ml={4}
            >
              ???????????????????? - {deviation}
            </Typography>
          )}
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box sx={{ width: "100%" }} mt={10} px={5}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={4}>
            <Input id="1" onSuccess={() => setImg1Ready(true)} />
          </Grid>
          <Grid item xs={4}>
            <Input id="2" onSuccess={() => setImg2Ready(true)} />
          </Grid>
          <Grid item xs={4}>
            <Typography>?????????????????? ???????????????????? ?????????????????????????? ???</Typography>
            <Item mt={2}>
              <Box display="flex" flexDirection="column">
                <canvas id="result" height="220"></canvas>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
