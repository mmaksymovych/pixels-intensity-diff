import { Box } from "@mui/material";
import { height, width } from "../constants";

const onLoadImageEnd = (id) => (e) => {
  var image = new Image();
  image.src = e.target.result;
  image.onload = function () {
    var canvas = document.getElementById(id);

    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0, width, height);
  };
};

export const Input = ({ id }) => (
  <Box display="flex" flexDirection="column">
    <input
      type="file"
      name="myImage"
      onChange={async (event) => {
        var file = event.target.files[0];

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = onLoadImageEnd(id);
      }}
    />
    <canvas id={id} />
  </Box>
);
