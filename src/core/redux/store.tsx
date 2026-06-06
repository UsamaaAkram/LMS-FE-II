import { configureStore, combineReducers } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice";
import themeSettingReducer from "./themeSettingSlice";
import authReducer from "./authSlice";
import coursesReducer from "./courses";
import studentReducer from "./studentSlice";
import studentCoursesReducer from "./studentCoursesSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  themeSetting: themeSettingReducer,
  auth: authReducer,
  courses: coursesReducer,
  student: studentReducer,
  studentCourses: studentCoursesReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
