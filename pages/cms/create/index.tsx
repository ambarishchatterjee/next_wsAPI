import { createMutation } from "@/customHooks/query/cms.query.createhooks";
import { createProps } from "@/typeScript/cms.interface";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Stack,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid2
} from "@mui/material";
import { useRouter } from "next/router";

const ProductCreate: React.FC = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createProps>();
  const { mutate, isPending } = createMutation();
  const [image, setImage] = useState<File | null>(null);

  const onSubmit = async (formData: createProps) => {
    const { title, description } = formData;
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", description);
    if (image) {
      formdata.append("image", image);
    } else {
      alert("Please upload an image");
      return;
    }

    mutate(formdata, {
      onSuccess: () => {
        reset();
        setImage(null);
        router.push("/cms/list")
      },
    });
  };

  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: "100vh",
        background: "#222",
      }}
    >
      <Paper
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 25,
          background: "#999",
          borderRadius: 0,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          style={{ marginBottom: 20 }}
        >
          Create Product
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("title", { required: "Title is required" })}
            label="Title"
            placeholder="Enter product title"
            fullWidth
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            {...register("description", {
              required: "Description is required",
            })}
            label="Description"
            placeholder="Enter product description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Upload Product Image
            </Typography>
            <TextField
             {...register("image", {
              required: "Image is required",
            })}
              type="file"
              fullWidth
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                marginBottom: 2,
              }}
            />
            {image && (
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ marginBottom: 2 }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="Profile Preview"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                  }}
                />
                <Typography variant="caption">{image.name}</Typography>
              </Stack>
            )}
          </Box>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            
            sx={{ mt: 3, fontSize: 18, background: "#000", color: "#fff" }}
            disabled={isPending}
          >
            <b>{isPending ? "Creating..." : "Create Product"}</b>
          </Button>
        </form>
      </Paper>
    </Grid2>
  );
};

export default ProductCreate;
