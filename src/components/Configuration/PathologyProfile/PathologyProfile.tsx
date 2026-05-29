import { useMemo, useState } from "react";
import PathologyProfileCreate, { type PathologyProfileFormPayload } from "./PathologyProfileCreate";
import PatholoyProfileList from "./PathologyProfileList";
import {
  PathologyProfileMockData,
  type PathologyProfileItem,
} from "./PathologyProfileMockData";

function getNextId(items: { id: number }[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function PathologyProfile() {
  const [pathologyProfiles, setPathologyProfiles] = useState<PathologyProfileItem[]>(PathologyProfileMockData);

  const [pathologyProfileModal, setPathologyProfileModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    value: PathologyProfileItem | null;
  }>({ isOpen: false, mode: "create", value: null });


  const PathologyProfileOptions = useMemo(
    () => pathologyProfiles.map((PathologyProfile) => ({ id: PathologyProfile.id, name: PathologyProfile.name })),
    [pathologyProfiles],
  );

  const closePathologyProfileModal = () =>
    setPathologyProfileModal({ isOpen: false, mode: "create", value: null });

  const handleSavePathologyProfile = (payload: PathologyProfileFormPayload) => {
    const editingPathologyProfile =
      pathologyProfileModal.mode === "edit" ? pathologyProfileModal.value : null;
    const PathologyProfileId = editingPathologyProfile ? editingPathologyProfile.id : getNextId(pathologyProfiles);

    const nextPathologyProfiles = editingPathologyProfile
      ? pathologyProfiles.map((pathologyProfile) =>
        pathologyProfile.id === PathologyProfileId
          ? {
            ...pathologyProfile,
            code: payload.code,
            name: payload.name,
            linkedParameterIds: payload.linkedParameterIds,
          }
          : pathologyProfile,
      )
      : [
        ...pathologyProfiles,
        {
          id: PathologyProfileId,
          code: payload.code,
          name: payload.name,
          linkedParameterIds: payload.linkedParameterIds,
          isActive: true,
        },
      ];

    setPathologyProfiles(nextPathologyProfiles);
    closePathologyProfileModal();
  };

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e8ebf0",
        borderRadius: "14px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >

      <div style={{ flex: 1, minHeight: 0 }}>
        <PatholoyProfileList
          rows={pathologyProfiles}
          onAdd={() =>
            setPathologyProfileModal({ isOpen: true, mode: "create", value: null })
          }
          onEdit={(row) =>
            setPathologyProfileModal({ isOpen: true, mode: "edit", value: row })
          }
          onToggleStatus={(id) =>
            setPathologyProfiles((prev) =>
              prev.map((PathologyProfile) =>
                PathologyProfile.id === id
                  ? { ...PathologyProfile, isActive: !PathologyProfile.isActive }
                  : PathologyProfile,
              ),
            )
          }
        />

      </div>

      <PathologyProfileCreate
        isOpen={pathologyProfileModal.isOpen}
        mode={pathologyProfileModal.mode}
        initialValue={pathologyProfileModal.value}
        parameterOptions={PathologyProfileOptions}
        onClose={closePathologyProfileModal}
        onSave={handleSavePathologyProfile}
      />
    </section>
  );
}

export default PathologyProfile;
