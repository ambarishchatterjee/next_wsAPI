import {
  Button,
  Grid2,
  Paper,
  TextField,
  Typography,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginMutation } from "@/customHooks/query/auth.query.hooks";
import { loginProps } from "@/typeScript/auth.interface";
import { useRouter } from "next/router";

const Login: React.FC = () => {
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginProps>();
  const router = useRouter();
  const { mutate, isPending } = loginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // ....Functions......
  const onsubmit = async (formData: FieldValues) => {
    const { email, password } = formData as { email: string; password: string };
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);
    mutate(formData, {});
    console.log(formData);
    reset();
    
  };

  const handleLoginError = () => {
      router.push("/auth/registration"); 
      
    }
  

  return (
    <>
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
          elevation={10}
          style={{
            padding: 30,
            width: 300,
            background: "#999",
            boxShadow: "0 4px 20px rgba(65, 64, 64, 0.8)",
          }}
        >
          <Box textAlign="center">
            <Typography
              style={{ margin: "20px 0", color: "#000", fontSize: '22px' }}
            >
              Sign In
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onsubmit)}>
            <TextField
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email format",
                },
              })}
              label="Email"
              placeholder="Enter email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email && errors.email.message}
              variant="standard"
              InputLabelProps={{
                style: { color: '#000' }, 
             }}
            />

            <Box sx={{ position: "relative", width: "100%" }}>
              <TextField
                {...register("password", { required: "Password is required" })}
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                variant="standard"
                InputLabelProps={{
                  style: { color: '#000' }, 
               }}
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

            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{
                margin: "20px 0",
                background: "#000",
                color: "#fff",
              }}
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Sign In"}
            </Button>

            <Button
              variant="text"
              fullWidth
              style={{
                color: "#000",
                fontWeight: "bold",
                textTransform: "none",
              }}
              onClick={handleLoginError}
            >
              Don't have an account? Register here
            </Button>
          </form>
        </Paper>
      </Grid2>
    </>
  );
};

export default Login;
