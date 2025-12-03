import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'nprogress/nprogress.css';
import './styles/global.css'
import ErrorPage from './pages/error.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,

  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(

  <RouterProvider router={router} />

)
