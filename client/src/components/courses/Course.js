import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { Card } from "@mui/material";
import { CardActions, CardContent, Grid, Typography, } from "@mui/material";
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';



const Course = ({
  id, name, year, description, finished, clickCourseFinished
}) => {

  return (<div>
    
    <Card
      style={{
        margin: 30,
        width: 400,
        height: 200,
        padding: 30,
        position: "relative",
      }}
      key={id}
    >
      <CardContent>
        <Typography
          gutterBottom
          variant="h6"
          style={{
            margin: 5,
            display: 'inline-flex',
            alignItems: 'center',
          }}

        >
          <LocalLibraryIcon /> {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: 3,
          }}
        >
          {description}
        </Typography>
      </CardContent>
      <CardActions
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          margin: 10,
        }}
      >

        <span>{
          finished === "false" ? (
            <button

              onClick={() => clickCourseFinished(id)}
            >
              Finish Course
            </button>
          ) : <Typography
            variant="body2"
            color="rgb(50,205,50)"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitLineClamp: 3,
            }}
          >Course Finished</Typography>

        }
        </span>

      </CardActions>
      <CardActions
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          margin: 20,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitLineClamp: 3,
          }}
        >Started in: {year}</Typography>


      </CardActions>
    </Card>
  </div>

  );
};

Course.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  finished: PropTypes.string.isRequired,
};

export default Course;
