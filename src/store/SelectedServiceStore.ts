import { type } from 'os';
import { create } from 'zustand';

type SelectedServiceStore = {
    selectedService: string | null;
    setSelectedService: (service: string) => void;
};

export const useSelectedServiceStore = create<SelectedServiceStore>((set) => ({
    selectedService: null,
    setSelectedService: (service) => set(() => ({ selectedService: service })),
}));