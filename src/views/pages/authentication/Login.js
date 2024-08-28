// ** React Imports

import "@styles/react/pages/page-authentication.scss";

import {
  Button,
  CardText,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../../../utility/apiRequest";
import { AbilityContext } from "@src/utility/context/Can";
import InputPasswordToggle from "@components/input-password-toggle";
import LoadingContext from "../../../utility/context/LoadingContext";
import axios from "axios";
import { getHomeRouteForLoggedInUser } from "@utils";
import { handleLogin } from "@store/authentication";
import logo from "@src/assets/images/logo/logo-white.svg";
import toast from "react-hot-toast";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useSkin } from "@hooks/useSkin";

const defaultValues = {
  password: "",
  loginEmail: "",
  rememberMe: false,
};

const Login = () => {
  // ** Hooks
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ability = useContext(AbilityContext);
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const { setLoading } = useContext(LoadingContext);

  const onSubmit = (data) => {
    if (data.loginEmail && data.password) {
      setLoading(true);
      const body = {
        email: data.loginEmail,
        password: data.password,
        role: "admin",
      };

      axios
        .post(API_BASE_URL + "/admin/login", body)
        .then((res) => {
          if (res.data.status) {
            const data = {
              id: res.data.data.userDetails.userID,
              fullName: res.data?.data?.userDetails?.fullName,
              email: res.data?.data?.userDetails?.email,
              companyName: res.data?.data?.userDetails?.companyName,
              profileImage: res.data?.data?.userDetails?.profileImage,
              role: "admin",
              ability: [
                {
                  action: "manage",
                  subject: "all",
                },
              ],
              extras: {
                eCommerceCartItemsCount: 5,
              },
              accessToken: res.data.data.accessToken,
              refreshToken: res.data.data.accessToken,
            };

            dispatch(handleLogin(data));
            ability.update([
              {
                action: "manage",
                subject: "all",
              },
            ]);
            if (data.rememberMe) {
              localStorage.setItem("rememberMe", JSON.stringify(body));
            }
            setLoading(false);
            navigate(getHomeRouteForLoggedInUser("admin"));
            // toast.success("User has been successfully .");
          } else {
            setLoading(false);
            toast.error(res.data.message);
          }
        })
        .catch((err) => setLoading(false));
    } else {
      toast.error("Fill the details.");
    }
  };

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Col
          className="loginbg d-none d-lg-flex align-items-center p-5"
          lg="6"
          sm="12"
        >
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="logologin" src={logo} alt="logo" />
          </div>
        </Col>
        <Col
          className="loginform d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="6"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="12" md="12" lg="12">
            <CardTitle tag="h2" className="loginhead mb-1">
              Welcome to Schule im Griff
            </CardTitle>
            <CardText className="mb-2">
              Enter your email address and password to access admin panel.
            </CardText>
            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Controller
                  id="loginEmail"
                  name="loginEmail"
                  control={control}
                  render={({ field }) => (
                    <Input
                      autoFocus
                      type="email"
                      placeholder="Enter Email"
                      invalid={errors.loginEmail && true}
                      {...field}
                    />
                  )}
                />
                {errors.loginEmail && (
                  <FormFeedback>{errors.loginEmail.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                </div>
                <Controller
                  id="password"
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className="input-group-merge"
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="form-check mb-1">
                <Input type="checkbox" id="remember-me" />
                <Label className="form-check-label" for="remember-me">
                  Remember Me
                </Label>
              </div>
              <Button
                className="login_btn mt-3"
                type="submit"
                color="primary"
                block
              >
                Sign In
              </Button>
              <p className="text-center firstime">
                <Link to="/forgot-password">
                  <small>Forgot Password?</small>
                </Link>
              </p>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
