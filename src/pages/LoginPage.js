import React, { useState } from 'react';
import '../components/withemail.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from '../Context/Authcontext';
import { appwriteAuth } from '../Auth/appwriteauth';
import { useAppState } from '../Context/AppStateContext';

const LoginForm = () => {
  const navigate = useNavigate()
  const [email,setemail] = useState("")
  const [password,setpassword] = useState("")
  const {showToast,setline} = useAppState()
  const {updateuser} = useAuthState();
  const [showPassword, setShowPassword] = useState(false);
  const [islogingin,setislogingin] = useState(false)
  const [isforget,setisforget] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function login(e) {
    e.preventDefault();
    try {
      setislogingin(true);
     await setline(90,true);
      if(isforget)
      {
       const response = await appwriteAuth.requestPasswordReset(email);
       console.log(response);
       if(response.success)
       {
        showToast.success(response.message);
       await setline(0)
        return
       }
       showToast.error(response.message);
     await setline(0)

       return;
      }
      const response =  await appwriteAuth.login(email, password);
      console.log(response);
      if(response.success)
      {
        response.user.name = response.user.email.split("@")[0];
        updateuser(response.user);
       await setline(0)
       showToast.success(response.message);
        navigate(`/user/${response.user.$id}`)
        return;

      }
     await setline(0)
      showToast.error(response.message);
      
    } catch (error) {
     await setline(0)
      console.log(error.message);
      showToast.error(error.message);
      
    }
    finally{
      setislogingin(false);
    }

  }

  return (
    <div className="container">
      <div className="header">
        <h1>{isforget ? "Enter Your Credentials": "Login Account"}</h1>
        <p>{isforget ? "we will send a link for reseting your password": "Enter your Email and Password to access Accout"}</p>
      </div>

      <div className="form-container">
        <form id="loginForm" onSubmit={login}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              required
              onChange={(e)=>setemail(e.target.value)}
            />
          </div>

           
           {!isforget && 
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-control"
                placeholder="Enter your password"
                required
                onChange={(e)=>setpassword(e.target.value)}
                />
              <i
                className={`toggle-password fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                id="togglePassword"
                onClick={togglePasswordVisibility}
                ></i>
            </div>
          </div>
              }
          <button onClick={(e)=>
          {

            e.preventDefault()
            setisforget(!isforget);
          }
            
          } 
          type="button" style={{background:"none",border:"none", cursor:"pointer"}} className="link">
              {isforget?"Switch to Login":"Forgot password?"}  
              </button>

          <div className="form-group mt-3">
            <button type="submit" id="submitBtn" className="btn btn-block">
              {islogingin?"Processing...": isforget?"Request Reset Link":"Login" }
            </button>
          </div>

          <div className="text-center mt-3">
            <p className="text-muted">
              Don’t have an account?{' '}
              <Link to="/signupWithEmail" className="link">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;