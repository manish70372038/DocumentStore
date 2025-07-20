import { useEffect } from "react";
import "./App.css";
import { BrowserRouter,} from "react-router-dom";
import { useAuthState } from "./Context/Authcontext";
import { useAppState } from "./Context/AppStateContext";
import Toast from "./components/Toast";
import RouteHandler from "./components/Routhandler";

function App() {
  const {toast,setToast} = useAppState()
  const {routes,user} = useAuthState();

  return (
    <BrowserRouter>
        <div className="App">
         <RouteHandler routes={routes}/>
           {toast.show && (
  <Toast 
    message={toast.message} 
    type={toast.type} 
    onClose={() => setToast({...toast, show: false})}
    duration={toast.duration}
  />
)}
        </div>
    </BrowserRouter>
  );
}

export default App;
