import { Box } from "@mui/material";

export const Input = ({ id }) => (
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
