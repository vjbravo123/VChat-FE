import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './components/Signup.jsx'
import ChatPage from './components/ChatPage.jsx'
import ChatList from './components/ChatList.jsx'

const router = createBrowserRouter([{
  path:'/login',
  element:<App/>
},
  {
    path:'/signup',
    element: <Signup/>
  },
  {
    path:'/chatlist',
    element:<ChatList/>
  },
  {
    path:'/chat/:roomId',
    element:<ChatPage/>
  }
])

createRoot(document.getElementById('root')).render(
<RouterProvider router={router}/>

)
