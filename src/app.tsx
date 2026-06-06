import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { base_path } from "./environment.tsx";
import ALLRoutes from "./feature-module/router/router";

const App = () => {
  const mode = useSelector((state: any) => state.themeSetting?.mode || "dark");
  const isDark = mode === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? "#e6e9ee" : "#1f2937",
          borderRadius: 10,
          fontFamily: "Inter, sans-serif",
        },
      }}
    >
      <BrowserRouter basename={base_path}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          theme={isDark ? "dark" : "light"}
        />
        <ALLRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
