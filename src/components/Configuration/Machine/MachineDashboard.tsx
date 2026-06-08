import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store";
import {
  fetchMachines,
  fetchMachineParameters,
  selectMachines,
  selectMachineParameters,
  updateMachine,
  updateMachineParameter,
} from "../../../store/MachineSlice";
import { selectClinics } from "../../../store/clinicSlice";
import type { MachineItem, MachineParameterItem } from "../../../types/Machine.types";
import MachineCreate from "./MachineCreate";
import MachineList from "./MachineList";
import ParameterCreate from "./ParameterCreate";
import ParameterList from "./ParameterList";
import "../../../styles/Configuration/Machine/MachineDashboard.css";

type ActiveTab = "machine" | "parameter";

const tabs: { key: ActiveTab; label: string }[] = [
  { key: "machine", label: "Machine" },
  { key: "parameter", label: "Machine-Parameters" },
];

function MachineDashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const machines = useSelector(selectMachines);
  const machineParameters = useSelector(selectMachineParameters);
  const clinics = useSelector(selectClinics);

  const clinicId = String(clinics[0]?.id ?? "");

  const [activeTab, setActiveTab] = useState<ActiveTab>("machine");

  const [machineModal, setMachineModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    value: MachineItem | null;
  }>({ isOpen: false, mode: "create", value: null });

  const [parameterModal, setParameterModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    value: MachineParameterItem | null;
  }>({ isOpen: false, mode: "create", value: null });

  useEffect(() => {
    dispatch(fetchMachines());
    dispatch(fetchMachineParameters());
  }, [dispatch]);

  const parameterOptions = useMemo(
    () =>
      machineParameters.map((p: MachineParameterItem) => ({
        id: p.id,
        name: p.machineParameterName,
      })),
    [machineParameters],
  );

  const machineOptions = useMemo(
    () =>
      machines.map((m: MachineItem) => ({
        id: m.id,
        name: m.machineName,
      })),
    [machines],
  );

  const closeMachineModal = () =>
    setMachineModal({ isOpen: false, mode: "create", value: null });

  const closeParameterModal = () =>
    setParameterModal({ isOpen: false, mode: "create", value: null });

  // Send all required fields on every PUT — backend rejects partial payloads
  const handleToggleMachineStatus = (id: string) => {
    const machine = machines.find((m: MachineItem) => m.id === id);
    if (!machine) return;
    dispatch(
      updateMachine({
        id,
        payload: {
          clinic: machine.clinicId,
          machine_code: machine.machineCode,
          machine_name: machine.machineName,
          machine_parameters: machine.machineParameterIds,
          status: !machine.isActive,
        },
      }),
    );
  };

  const handleToggleParameterStatus = (id: string) => {
    const parameter = machineParameters.find(
      (p: MachineParameterItem) => p.id === id,
    );
    if (!parameter) return;
    dispatch(
      updateMachineParameter({
        id,
        payload: {
          machine_parameter_code: parameter.machineParameterCode,
          machine_parameter_name: parameter.machineParameterName,
          status: !parameter.isActive,
        },
      }),
    );
  };

  const machineRows = useMemo(
    () =>
      machines.map((m: MachineItem) => ({
        ...m,
        code: m.machineCode,
        name: m.machineName,
        linkedParameterIds: m.machineParameterIds,
      })),
    [machines],
  );

  const parameterRows = useMemo(
    () =>
      machineParameters.map((p: MachineParameterItem) => ({
        ...p,
        code: p.machineParameterCode,
        name: p.machineParameterName,
        linkedMachineIds: machines
          .filter((m: MachineItem) => m.machineParameterIds.includes(p.id))
          .map((m: MachineItem) => m.id),
      })),
    [machines, machineParameters],
  );

  return (
    <section className="machine-dashboard">
      <div className="machine-dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`machine-dashboard-tab${
              activeTab === tab.key ? " machine-dashboard-tab--active" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="machine-dashboard-content">
        {activeTab === "machine" ? (
          <MachineList
            rows={machineRows}
            onAdd={() =>
              setMachineModal({ isOpen: true, mode: "create", value: null })
            }
            onEdit={(row) =>
              setMachineModal({
                isOpen: true,
                mode: "edit",
                value: machines.find((m: MachineItem) => m.id === row.id) ?? null,
              })
            }
            onToggleStatus={handleToggleMachineStatus}
          />
        ) : (
          <ParameterList
            rows={parameterRows}
            onAdd={() =>
              setParameterModal({ isOpen: true, mode: "create", value: null })
            }
            onEdit={(row) =>
              setParameterModal({
                isOpen: true,
                mode: "edit",
                value:
                  machineParameters.find(
                    (p: MachineParameterItem) => p.id === row.id,
                  ) ?? null,
              })
            }
            onToggleStatus={handleToggleParameterStatus}
          />
        )}
      </div>

      <MachineCreate
        isOpen={machineModal.isOpen}
        mode={machineModal.mode}
        initialValue={machineModal.value}
        clinicId={machineModal.value?.clinicId ?? clinicId}
        parameterOptions={parameterOptions}
        onClose={closeMachineModal}
        onSave={closeMachineModal}
      />

      <ParameterCreate
        isOpen={parameterModal.isOpen}
        mode={parameterModal.mode}
        initialValue={parameterModal.value}
        machines={machines}
        machineOptions={machineOptions}
        onClose={closeParameterModal}
        onSave={closeParameterModal}
      />
    </section>
  );
}

export default MachineDashboard;