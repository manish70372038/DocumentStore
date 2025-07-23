import "./App.css";
import { BrowserRouter,} from "react-router-dom";
import { useAuthState } from "./Context/Authcontext";
import { useAppState } from "./Context/AppStateContext";
import Toast from "./components/Toast";
import RouteHandler from "./components/Routhandler";
import Progressbar from "./components/progress";

function App() {
  const {toast,setToast,line} = useAppState()
  const {routes} = useAuthState()
  return (
    <BrowserRouter>
        <div className="App">
          <Progressbar line={line}/>  
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
