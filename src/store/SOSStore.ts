import { create } from 'zustand';

type SOSStoreType = {
    sos: boolean;
    setSOS: (sos: boolean) => void;
};

export const useSOSStore = create<SOSStoreType>((set) => ({
    sos: false,
    setSOS: (sos) => set({ sos }),
}));