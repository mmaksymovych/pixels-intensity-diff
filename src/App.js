import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const drawerWidth = 240;
const navItems = ["Home", "About", "Contact"];

const w = 1000;
const h = 800;

const Input = ({ id }) => (
  <Box display="flex" flexDirection="column">
    <input
      type="file"
      name="myImage"
      onChange={async (event) => {
        var file = event.target.files[0];

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
          console.log("res", e.target.result);

          var image = new Image();
          image.src = e.target.result;
          image.onload = function (ev) {
            var canvas = document.getElementById(id);
            canvas.width = w;

            const percent = canvas.width / image.width;

            console.log("p", percent);

            // const height = image.height * percent;
            const height = h;

            canvas.height = height;
            var ctx = canvas.getContext("2d");

            ctx.drawImage(image, 0, 0, w, h);
          };
        };
      }}
    />
    <canvas id={id} />
  </Box>
);

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
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
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            MUI
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: "#fff" }}>
                {item}
              </Button>
            ))}
          </Box>
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
          <Grid item xs={6}>
            <Input id="1" />
          </Grid>
          <Grid item xs={6}>
            <Input id="2" />
          </Grid>
          <Grid item xs={12}>
            <Item>
              <Box display="flex" flexDirection="column">
                <Button variant="contained" onClick={processImages}>
                  Process
                </Button>
                <canvas id="result"></canvas>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

function processImages() {
  const canvas1 = document.getElementById("1");
  const canvas2 = document.getElementById("2");

  const ctx1 = canvas1.getContext("2d");
  const ctx2 = canvas2.getContext("2d");

  const data1 = ctx1.getImageData(0, 0, w, h);
  const data2 = ctx2.getImageData(0, 0, w, h);

  const canvas = document.getElementById("result");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");

  ctx.rect(0, 0, w, h);
  ctx.fill();
  const data3 = ctx.getImageData(0, 0, w, h);

  for (var i = 0; i < data1.data.length; i += 4) {
    var ir = data1.data[i];
    var ig = data1.data[i + 1];
    var ib = data1.data[i + 2];

    var fr = data2.data[i];
    var fg = data2.data[i + 1];
    var fb = data2.data[i + 2];

    const dr = Math.abs(ir - fr) > 10 ? fr : 0;
    const dg = Math.abs(ig - fg) > 10 ? fg : 0;
    const db = Math.abs(ib - fb) > 10 ? fb : 0;

    const pxchanged = dr > 0 && dg > 0 && db > 0;
    data3.data[i] = pxchanged ? 255 : 0;
    data3.data[i + 1] = pxchanged ? 0 : 0;
    data3.data[i + 2] = pxchanged ? 0 : 0;
  }

  ctx.putImageData(data3, 0, 0);
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
