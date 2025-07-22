import { createContext, useContext, useState, useEffect } from "react";
import { appwriteAuth } from "../Auth/appwriteauth";
import { useAppState } from "./AppStateContext";
import setRoutes from "../configs/routconfig";
const AuthContext = createContext();
console.log("this is auth pre");
 const response = await appwriteAuth.getUser();
    if(response.success)
      {
        response.user.name = response.user.name?.trim() === "" ? response.user.email.split("@")[0] : response.user.name;
      } 
 const Routes = await setRoutes(response?.user || null);
   

export const AuthProvider = ({ children }) => {
  const {showToast} = useAppState()
  const [routes,setroutes] = useState(Routes);
  const [user, setuser] = useState(response?.user || null);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState(null);

  const updateuser = async (USER)=>{
        const r =  await setRoutes(USER);
        setroutes(r);
         setuser(USER);
  }

 
  const value = {
    user,
    setuser,
    routes,
    setroutes,
    updateuser,
    // loginWithEmail,
    // setCurrentUser,
    // signUpWithEmail,
    // continueWithGoogle,
    // logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }
  return context;
};
