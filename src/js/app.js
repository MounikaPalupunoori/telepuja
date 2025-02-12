// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';
import toastr from "toastr";
import "toastr/build/toastr.css";

// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-React Plugin
import Framework7React from 'framework7-react';

// Import Framework7 Styles
import 'framework7/framework7-bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

// Import App Component
import App from '../components/app.jsx';
import { Provider } from 'react-redux';
import store from '../store/store';

// Init F7 React Plugin
Framework7.use(Framework7React)

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: true,
  //progressBar: true,
  positionClass: "toast-bottom-full-width",
  preventDuplicates: true,
  onclick: null,
  showDuration: "3000",
  hideDuration: "3000",
  timeOut: "3300",
  extendedTimeOut: "4000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

// Mount React App
ReactDOM.render(
  
    React.createElement(App),
    document.getElementById('app')
  
);