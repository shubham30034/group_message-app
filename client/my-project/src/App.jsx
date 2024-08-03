import { useSocket } from "./SocketProvider/socketContext"
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Join from "./component/Join/Join";
import Chat from "./component/Join/Chat";

function App() {

  const socket = useSocket()
  console.log(socket,"socket");
   socket.on("connection",()=>{
    console.log("connected jh2");
   })

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Join/>}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
