import { useState } from 'react';
import { BrowserRouter } from "react-router"
import { Routing } from "./components"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./components/AuthContext";




const queryClient = new QueryClient();

const App = () => {

  const [user, setUser] = useState<any>(null);


  return (
    <div className='h-screen bg-gray-100'>
      <AuthProvider user={{ user, setUser }}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routing />
          </BrowserRouter>
        </QueryClientProvider>
      </AuthProvider>

    </div>
  )
}

export default App
