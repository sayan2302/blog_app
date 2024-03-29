import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getPostById, updatePostById, deletePostById } from "../../service/api";
import {
  Box,
  Typography,
  styled,
  InputBase,
  TextareaAutosize,
  keyframes,
} from "@mui/material";
import { Edit, Delete, Save } from "@mui/icons-material";
import { DataContext } from "../../context/DataProvider";
import Comments from "./comments/Comments";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Styles~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const blinkAnimation = keyframes`
  0% {
    border-color: #F1C40F;
  }
  50% {
    border-color: transparent;
  }
  100% {
    border-color: #F1C40F;
  }
`;
const Container = styled(Box)(({ theme }) => ({
  margin: "50px 80px",
  [theme.breakpoints.down("md")]: {
    margin: 0,
  },
}));
const Image = styled("img")({
  marginTop: "1%",
  objectFit: "cover",
  width: "100%",
  height: "50vh",
});
const Heading = styled(Typography)({
  fontSize: "38px",
  fontWeight: "600",
  margin: "50px 0 10px 0",
  wordBreak: "break-word",
  borderRadius: "10px",
  paddingLeft: "5px",
});
const EditHeading = styled(InputBase)({
  fontSize: "38px",
  fontWeight: "600",
  wordBreak: "break-word",
  width: "100%",
  height: "57px",
  border: "4px solid white",
  borderRadius: "10px",
  backgroundColor: "lightgoldenrodyellow",
  paddingLeft: "5px",
  color: "#566573",
  animation: `${blinkAnimation} 0.3s ease-out `,
});
const EditIcon = styled(Edit)({
  margin: "5px",
  padding: "5px",
  border: "1px solid #878787",
  borderRadius: "10px",
});
const SaveIcon = styled(Save)({
  margin: "5px",
  padding: "5px",
  border: "1px solid #878787",
  borderRadius: "10px",
});
const DeleteIcon = styled(Delete)({
  margin: "5px",
  padding: "5px",
  border: "1px solid #878787",
  borderRadius: "10px",
});
const Author = styled(Box)({
  color: "#878787",
  margin: "20px",
  display: "flex",
});
const Description = styled(Typography)({
  width: "100%",
  wordBreak: "break-word",
  fontFamily: "sans-serif",
  fontSize: "18px",
});
const TextArea = styled(TextareaAutosize)({
  width: "99.2%",
  wordBreak: "break-word",
  fontFamily: "sans-serif",
  fontSize: "18px",
  border: "4px solid white",
  borderRadius: "10px",
  backgroundColor: "lightgoldenrodyellow",
  animation: `${blinkAnimation} 0.3s ease-out `,
  color: "#566573",
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~main component~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const DetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState({});
  const { account } = useContext(DataContext);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [updatedPost, setUpdatedPost] = useState({
    title: "",
    description: "",
    picture: "",
    username: "",
    categories: "",
    createdDate: "",
  });

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~use effect~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  useEffect(() => {
    const fetchData = async () => {
      await getPostById(id).then((res) => {
        setPost(res.data);
      });
    };

    fetchData();
  }, [toggleEdit]);

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~handler functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const handleEdit = () => {
    setUpdatedPost({
      ...updatedPost,
      title: post.title,
      description: post.description,
      picture: post.picture,
      username: post.username,
      categories: post.categories,
      createdDate: post.createdDate,
    });
    setToggleEdit(true);
  };

  const handleSave = async () => {
    setToggleEdit(false);
    const updatePayload = [id, updatedPost];

    await updatePostById(updatePayload).catch((err) => console.log(err));

    setPost(updatedPost);
  };

  const handleDelete = async () => {
    await deletePostById(id)
      .then((res) => {
        if (res.status === 200) {
          navigate("/");
        }
      })
      .catch((err) => {
        console.log("Error:", err.response.data);
      });
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~renderer~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  return (
    <div style={{}}>
      <Container>
        <Image src={post.picture} />

        {/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Edit & Delete Buttons~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <Box style={{ float: "right" }}>
          {account.username === post.username && (
            <>
              {toggleEdit ? (
                <SaveIcon
                  onClick={() => {
                    handleSave();
                  }}
                  color="primary"
                />
              ) : (
                <EditIcon onClick={() => handleEdit()} color="primary" />
              )}
              <DeleteIcon onClick={() => handleDelete()} color="error" />
            </>
          )}
        </Box>

        {/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Title~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {toggleEdit ? (
          <EditHeading
            placeholder="Title"
            onChange={(e) => {
              setUpdatedPost({ ...updatedPost, title: e.target.value });
            }}
            defaultValue={post.title + "..."}
            name="title"
          />
        ) : (
          <Heading>{post.title}</Heading>
        )}

        {/* //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Author & Date ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <Author>
          <Typography>
            Author:{" "}
            <Box component="span" style={{ fontWeight: 600 }}>
              {post.username}
            </Box>
          </Typography>
          <Typography style={{ marginLeft: "auto" }}>
            {new Date(post.createdDate).toDateString()}
          </Typography>
        </Author>

        {/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Description~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {toggleEdit ? (
          <TextArea
            minRows={2}
            placeholder="Tell your story...."
            onChange={(e) => {
              setUpdatedPost({ ...updatedPost, description: e.target.value });
            }}
            defaultValue={post.description + "..."}
            name="description"
          />
        ) : (
          <Description>{post.description}</Description>
        )}
      </Container>
      <Comments post={post} />
    </div>
  );
};

export default DetailView;
