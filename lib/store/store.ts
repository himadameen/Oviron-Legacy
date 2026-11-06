import { configureStore } from "@reduxjs/toolkit";
import { strapiApi } from "./api/strapiApi";

export function makeStore() {
  return configureStore({
    reducer: {
      [strapiApi.reducerPath]: strapiApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(strapiApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
