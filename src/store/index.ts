import { configureStore } from "@reduxjs/toolkit";
import clinicReducer          from "./clinicSlice";
import sampleTubeReducer      from "./sampleTubeSlice";
import pathologyProfileReducer from "./pathologyProfileSlice";
<<<<<<< Updated upstream
import testReducer from "./testSlice";
import parameterReducer from "./parameterSlice";
import machineReducer from "./MachineSlice";
=======
import testReducer             from "./testSlice";
import parameterReducer        from "./parameterSlice";
import ordersReducer           from "./orders.slice";
import shipmentReducer         from "./shipment.slice";
>>>>>>> Stashed changes

export const store = configureStore({
  reducer: {
    clinic:          clinicReducer,
    sampleTube:      sampleTubeReducer,
    pathologyProfile: pathologyProfileReducer,
<<<<<<< Updated upstream
    test: testReducer,
    parameter: parameterReducer,
    machine: machineReducer,
=======
    test:            testReducer,
    parameter:       parameterReducer,
    orders:          ordersReducer,
    shipment:        shipmentReducer,
>>>>>>> Stashed changes
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;