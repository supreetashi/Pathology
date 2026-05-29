export type PathologyProfileItem = {
    id: number;
    code: string;
    name: string;
    linkedParameterIds: number[];
    isActive: boolean;
};

export const PathologyProfileMockData: PathologyProfileItem[] = [
    {
        id: 1,
        code: "Pus Culture & Sensitivity (C/S)",
        name: "4",
        linkedParameterIds: [1, 2, 3, 6],
        isActive: false,
    },
    {
        id: 2,
        code: "Gram Stain",
        name: "2",
        linkedParameterIds: [1, 2, 6],
        isActive: true,
    },
    {
        id: 3,
        code: "AFB Stain / TB Culture",
        name: "5",
        linkedParameterIds: [3, 4, 10, 11, 15],
        isActive: false,
    },
    {
        id: 4,
        code: "Fungal Culture",
        name: "3",
        linkedParameterIds: [3, 5],
        isActive: false,
    },
    {
        id: 5,
        code: "CBC (Complete Blood Count)",
        name: "2",
        linkedParameterIds: [7],
        isActive: false,
    },
    {
        id: 6,
        code: "CRP / ESR",
        name: "4",
        linkedParameterIds: [1, 4],
        isActive: true,
    },
    {
        id: 7,
        code: "Blood Culture",
        name: "3",
        linkedParameterIds: [8, 16, 15, 7],
        isActive: false,
    }
];