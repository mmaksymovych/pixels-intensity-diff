import * as React from 'react';
import PropTypes from "prop-types";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { processImages } from "./utils.js";
import {FormControlLabel, Slider, Switch, TextField} from "@mui/material";
import Button from '@mui/material/Button';
import {Input} from "./components";
import { saveAs } from 'file-saver';
import './App.css'

const drawerWidth = 240;

function DrawerAppBar(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [deviation, setDeviation] = React.useState({});
  const [img1Ready, setImg1Ready] = React.useState(false);
  const [img2Ready, setImg2Ready] = React.useState(false);
  const [ useAbsolute, setUseAbsolute ] = React.useState(false);
  const [ template, setUseTemplate ] = React.useState('left');


  const [ threadHold, setThreadHold ] = React.useState(10)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onClickProcessImage = () => {
    const deviation = processImages(template, threadHold);
    setDeviation(deviation);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Divider />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          <Box px={2}>
            <Typography id="input-slider" gutterBottom>
              Threshold:
            </Typography>
            <Slider
              aria-label="Threshold"
              defaultValue={threadHold}
              getAriaValueText={(value) => value}
              valueLabelDisplay="auto"
              step={5}
              marks
              min={5}
              max={50}
              onChange={(event, newValue) => {
                setThreadHold(newValue);
              }}
            />

            <Box my={2} mb={3}>
              <Typography id="input-slider" gutterBottom>
                Фонове зображення:
              </Typography>

              <ToggleButtonGroup
                color="primary"
                value={template}
                exclusive
                onChange={(event, newAlignment) => {
                  setUseTemplate(newAlignment);
                }}
                aria-label="Platform"
              >
                <ToggleButton value="left">Ліве</ToggleButton>
                <ToggleButton value="right">Праве</ToggleButton>
                <ToggleButton value="black">Чорний</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box mt={1}>
              <Button variant="outlined" fullWidth disabled={!img1Ready || !img2Ready} onClick={onClickProcessImage}>Опрацювати</Button>
            </Box>
            <Box my={2}>
              <Divider />
            </Box>
            <FormControlLabel control={<Switch checked={useAbsolute} onChange={(event) => {
              setUseAbsolute(event.target.checked);
            }} />} label="Відносні значення" />
            <Box mt={2}/>
            <Typography id="input-slider" gutterBottom>
              <b>Результат:</b>
            </Typography>
            <Typography id="input-slider" gutterBottom>
              Відхилення R:  {useAbsolute ? `${deviation.deviationR || 0}%` : `${deviation.deviationRAbs || 0}px`}
            </Typography>
            <Typography id="input-slider" gutterBottom>
              Відхилення G: {useAbsolute ? `${deviation.deviationG || 0}%` : `${deviation.deviationGAbs || 0}px`}
            </Typography>
            <Typography id="input-slider" gutterBottom>
              Відхилення B: {useAbsolute ? `${deviation.deviationB || 0}%` : `${deviation.deviationBAbs || 0}px`}
            </Typography>
            <Typography id="input-slider" gutterBottom>
              Сумарне відхилення: {useAbsolute ? `${deviation.res || 0}%` : `${deviation.resAbs || 0}px`}
            </Typography>
            <Box my={2}>
              <Divider />
            </Box>
            <Box mt={1}>
              <Button variant="outlined" fullWidth disabled={!deviation.res} onClick={() => {
                var canvas = document.getElementById("result");
                canvas.toBlob(function(blob) {
                  saveAs(blob, "pretty image.png");
                });

              }}>Зберегти результат</Button>
            </Box>
          </Box>

        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
             <Box sx={{ width: "100%", maxWidth: 1024 }} mt={10} px={5}>
               <Typography><b>Завдання:</b></Typography>
               <Typography style={{fontStyle: 'italic'}}>
                 Для двох однакових зображень обчислити середнє квадратичне відхилення інтенсивності пікселів. Вказати місця найбільшого відхилення Порівняти картинки різних форматів.
               </Typography><br/>
               <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                 <Grid item xs={6}>
                   <Input id="1" onSuccess={() => setImg1Ready(true)} imageReady={img1Ready}/>
                 </Grid>
                 <Grid item xs={6}>
                   <Input id="2" onSuccess={() => setImg2Ready(true)} imageReady={img2Ready}/>
                 </Grid>
                 <Grid item xs={2}></Grid>
                 <Grid item xs={8}>

                   <Box display="flex" flexDirection="column">
                     <canvas id="result" height="220"></canvas>
                   </Box>
                 </Grid>
               </Grid>
             </Box>

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
