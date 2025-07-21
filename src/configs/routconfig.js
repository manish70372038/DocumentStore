// routes.js

import SignupForm from "../components/WithEmail";
import LandingPage from "../pages/LandingPage";
import LoginForm from "../pages/LoginPage";
import Dashboard from "../pages/DashboardPage";
import Verify from "../pages/verify";
import ResetPasswordForm from "../pages/resetpassword";
console.log("normal routconfig file");
const setRoutes = async (user)=>{
 // Route Configuration
    const routes = [
  {
    path: "/",
    component: LandingPage,
    isvalid: user ? false :true ,
    direct:`/user/${user?.$id}` 
},
{
    path: "/signupWithEmail",
    component: SignupForm,
    isvalid: user ? false :true,
    direct:"/",  
},
  {
      path: "/signin",
      component: LoginForm,
      isvalid: user ? false :true,
      direct:"/",  
    },
    {
        path: "/user/:id",
        component: Dashboard,
        isvalid: user ? true:false,
        direct:"/" 
    },
    {
        path: "/verify",
        component: Verify,
        isvalid: user ? false:true,
        direct:"/" 
    },
    {
        path: "/reset-password",
        component: ResetPasswordForm,
        isvalid: user ? false:true,
        direct:"/" 
    },
    
];

return routes;

}
export default setRoutes;
