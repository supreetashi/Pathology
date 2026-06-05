import { configureStore } from "@reduxjs/toolkit";
import clinicReducer from "./clinicSlice";
import sampleTubeReducer from "./sampleTubeSlice";
import pathologyProfileReducer from "./pathologyProfileSlice";
import testReducer from "./testSlice";
import parameterReducer from "./parameterSlice";
import machineReducer from "./MachineSlice";

export const store = configureStore({
  reducer: {
    clinic: clinicReducer,
    sampleTube: sampleTubeReducer,
    pathologyProfile: pathologyProfileReducer,
    test: testReducer,
    parameter: parameterReducer,
    machine: machineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;