import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import { persistor, store } from "./core/redux/store";

import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "../node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "../node_modules/@tabler/icons-webfont/dist/tabler-icons.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../src/style/css/iconsax.css";
import App from "./app.tsx";
import { applyTheme } from "./core/redux/themeSettingSlice";
import "./index.scss";

// Apply the saved (or default-dark) theme before first paint.
applyTheme((store.getState() as any).themeSetting?.mode || "dark");

// Keep the axios Authorization header in sync with the persisted auth token,
// so every protected API call is authenticated (backend now enforces JWT).
const applyAuthHeader = () => {
  const token = (store.getState() as any).auth?.token;
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};
applyAuthHeader();
store.subscribe(applyAuthHeader);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
