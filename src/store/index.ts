import { configureStore } from "@reduxjs/toolkit";
import clinicReducer from "./clinicSlice";
import sampleTubeReducer from "./sampleTubeSlice";
import testReducer from "./testSlice";

export const store = configureStore({
  reducer: {
    clinic: clinicReducer,
    sampleTube: sampleTubeReducer,
    test: testReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
