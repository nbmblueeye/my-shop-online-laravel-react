import React from 'react'
import ReactDOM from 'react-dom/client';

import '../src/assets/_config.scss';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { RouterProvider } from 'react-router-dom'
import router from './routes/route';

import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss';
import SettingContext from './contexts/SettingContext';
import ThemeModeContext from './contexts/ThemeModeContext';
import { HelmetProvider} from 'react-helmet-async';
import UserContext from './contexts/Auth/UserContext';

window.Swal = Swal;
let toast   = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});
window.toast = toast;

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <React.StrictMode>
      <HelmetProvider>
        <UserContext>
          <ThemeModeContext>
            <SettingContext>
              <RouterProvider router={router}/>
            </SettingContext>
          </ThemeModeContext>
        </UserContext>
      </HelmetProvider>
    </React.StrictMode>
  </>,
)
