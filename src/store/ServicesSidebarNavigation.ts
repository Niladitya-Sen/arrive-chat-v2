import { create } from 'zustand';

type ServicesSidebarNavigationState = {
    isOpen: boolean;
    toggle: () => void;
};

export const useServicesSidebarNavigation = create<ServicesSidebarNavigationState>(
    (set) => ({
        isOpen: true,
        toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    })
);
