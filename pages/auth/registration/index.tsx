import { registerMutation } from "@/customHooks/query/auth.query.hooks";
import { registerProps } from "@/typeScript/auth.interface";
import { useState } from "react";
import {
  Stack,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Grid2,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/router";

const Registration: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<registerProps>();
  const router = useRouter();
  const { mutate, isPending } = registerMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (formData: FieldValues) => {
    const { first_name, last_name, email, password } =
      formData as registerProps;
    const formdata = new FormData();
    formdata.append("first_name", first_name);
    formdata.append("last_name", last_name);
    formdata.append("email", email);
    formdata.append("password", password);
    if (image) {
      formdata.append("profile_pic", image);
    }
    mutate(formdata, {});
    console.log(formdata);
    reset();
    setImage(null);
  };

  const handleRegisterError = () => {
    router.push("/auth/login");
  };

  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        background:
          "#222",
        padding: 2,
      }}
    >
      <Box
        component="form"
        sx={{
          width: "100%",
          maxWidth: 350,
          backgroundColor: "#999",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
          padding: 4,
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography
          style={{ margin: "20px 0", color: "#000", fontSize: '22px' }}
        >
          Registration Form
        </Typography>
        <TextField
          {...register("first_name", { required: "First name is required" })}
          label="First Name"
          fullWidth
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
          margin="normal"
        />
        <TextField
          {...register("last_name", { required: "Last name is required" })}
          label="Last Name"
          fullWidth
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
          margin="normal"
        />
        <Box sx={{ position: "relative", width: "100%" }}>
          <TextField
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email format",
              },
            })}
            label="Email"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
          />
          <EmailOutlinedIcon
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(0, 0, 0, 0.54)",
            }}
          />
        </Box>
        <Box sx={{ position: "relative", width: "100%" }}>
          <TextField
            {...register("password", { required: "Password is required" })}
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
          />
          <IconButton
            onClick={togglePasswordVisibility}
            sx={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Box>
        <TextField
          {...register("profile_pic", {
            required: "Profile picture is required",
          })}
          type="file"
          fullWidth
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
              setImage(e.target.files[0]);
            }
          }}
          error={!!errors.profile_pic}
          helperText={errors.profile_pic?.message}
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
        <Button
          type="submit"
          variant="contained"
          fullWidth
          
          sx={{ padding: 1.5, fontWeight: 600 }}
          disabled={isPending}
        >
          {isPending ? "Registering..." : "Register Now!"}
        </Button>
        <Button
          variant="text"
          fullWidth
          style={{
            color: "#000",
            fontWeight: "bold",
            textTransform: "none",
          }}
          onClick={handleRegisterError}
        >
          Already have an account? Login
        </Button>
      </Box>
    </Grid2>
  );
};

export default Registration;
