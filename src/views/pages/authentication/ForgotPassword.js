// ** React Imports

import "@styles/react/pages/page-authentication.scss";

import {
  Button,
  CardText,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { ChevronLeft } from "react-feather";
import LoadingContext from "../../../utility/context/LoadingContext";
import { apiRequest } from "../../../utility/apiRequest";
import { isUserLoggedIn } from "@utils";
import logo from "@src/assets/images/logo/logo-white.svg";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const [adminMail, setAdminMail] = useState("");
  // ** Hooks

  const handleSubmit = async () => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (regex.test(adminMail)) {
      setLoading(true);
      const payload = {
        email: adminMail,
        role: "admin",
      };
      const resp = await apiRequest._requestForgotPassword(payload);
      setLoading(false);
      if (resp.status) {
        toast.success(resp.message);
      } else {
        toast.error(resp.message);
      }
    } else {
      toast.error("Email is invalid.");
    }
  };

  if (!isUserLoggedIn()) {
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
            <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
              <CardTitle tag="h2" className="loginhead mb-1">
                Forgot Password? 🔒
              </CardTitle>
              <CardText className="mb-2">
                Enter your email and we'll send you instructions to reset your
                password
              </CardText>
              <Form
                className="auth-forgot-password-form mt-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="mb-1">
                  <Label className="form-label" for="login-email">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="login-email"
                    placeholder="Enter Email"
                    onChange={(e) => setAdminMail(e.target.value)}
                    autoFocus
                  />
                </div>
                <Link onClick={handleSubmit}>
                  <Button className="login_btn mt-3" color="primary" block>
                    Send Reset Link
                  </Button>
                </Link>
              </Form>
              <p className="text-center mt-2">
                <Link onClick={() => navigate(-1)}>
                  <ChevronLeft className="rotate-rtl me-25" size={14} />
                  <span className="align-middle">Back to login</span>
                </Link>
              </p>
            </Col>
          </Col>
        </Row>
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default ForgotPassword;
