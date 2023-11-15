import { create } from 'zustand';

export type AlertStoreType = {
    isAlertOpen: boolean;
    message: string;
    type: string;
    openAlert: (message: string, type: string) => void;
    closeAlert: () => void;
};

export const useAlertStore = create<AlertStoreType>((set) => ({
    isAlertOpen: false,
    message: '',
    type: 'success',
    openAlert: (message: string, type: string) => set({ isAlertOpen: true, message, type }),
    closeAlert: () => set({ isAlertOpen: false, message: '', type: 'success' })
}));