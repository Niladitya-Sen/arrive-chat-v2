import { create } from 'zustand';

type VoiceStoreType = {
    state: boolean;
    setState: (state: boolean) => void;
    pause: () => void;
    resume: () => void;
}

const useVoiceStore = create<VoiceStoreType>((set) => ({
    state: false,
    setState: (state) => set({ state }),
    pause: () => set({ state: false }),
    resume: () => set({ state: true }),
}));

export default useVoiceStore;