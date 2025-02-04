import { BrowserRouter } from "react-router"
import { Routing } from "./components"

const App = () => {
  return (
    <div className='h-screen bg-gray-100'>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>

    </div>
  )
}

export default App
