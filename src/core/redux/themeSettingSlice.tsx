import { createSlice } from "@reduxjs/toolkit";

const getStored = () => {
  try {
    return localStorage.getItem("bv-theme") || "dark";
  } catch {
    return "dark";
  }
};

export const applyTheme = (mode: string) => {
  const root = document.documentElement;
  root.setAttribute("data-bs-theme", mode);
  root.classList.toggle("theme-dark", mode === "dark");
  root.classList.toggle("theme-light", mode === "light");
};

const initialState = {
  mode: getStored(), // "dark" | "light"  (defaults to dark)
};

const themeSettingSlice = createSlice({
  name: "themeSetting",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("bv-theme", action.payload);
      applyTheme(action.payload);
    },
    toggleTheme: (state) => {
      const next = state.mode === "dark" ? "light" : "dark";
      state.mode = next;
      localStorage.setItem("bv-theme", next);
      applyTheme(next);
    },
  },
});

export const { setTheme, toggleTheme } = themeSettingSlice.actions;
export default themeSettingSlice.reducer;
