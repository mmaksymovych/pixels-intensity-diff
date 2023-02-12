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

export const Input = ({ id, onSuccess, imageReady }) => (
  <Box display="flex" flexDirection="column">
    <label htmlFor={`file=${id}`} className="custom-file-upload">
      <i className="fa fa-cloud-upload"></i> Завантажити зображення {id}
    </label>
    <input
      id={`file=${id}`}
      className="custom-file-upload"
      type="file"
      name="myImage"
      accept="image/*"
      required
      onChange={async (event) => {
        onSuccess();
        var file = event.target.files[0];

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = onLoadImageEnd(id);
      }}
    />
    {
      imageReady ? (
        <canvas id={id} />
      ) : (
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"/>

      )
    }


    </Box>
);
