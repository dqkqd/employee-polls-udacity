import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAuth } from "../../app/hook";
import { validateUser } from "./authSlice";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const auth = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await dispatch(validateUser({ id, password }));
  };

  useEffect(() => {
    if (auth.status === "success") {
      navigate("/");
    }
  }, [auth, navigate]);

  return (
    <>
      <FormControl>
        <InputLabel htmlFor="user-id">Employee ID</InputLabel>
        <Input id="user-id" value={id} onChange={handleUserId} data-testid="login-form-input-id" />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownShowPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          data-testid="login-form-input-password"
        />
      </FormControl>
      <Button
        variant="contained"
        onClick={handleLogin}
        disabled={!id || !password || auth.status === "loading"}
        data-testid="login-form-login-button"
      >
        {auth.status === "loading" ? <CircularProgress /> : "Log In"}
      </Button>

      {auth.status === "failed" && (
        <Typography fontSize={13} color="red">
          Incorrect Employee ID or Password
        </Typography>
      )}
    </>
  );
};

export default LoginForm;
