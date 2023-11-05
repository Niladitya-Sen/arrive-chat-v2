import { create } from 'zustand';

type ChatSidebarNavigationState = {
    isOpen: boolean;
    toggle: () => void;
};

export const useChatSidebarNavigation = create<ChatSidebarNavigationState>(
    (set) => ({
        isOpen: false,
        toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    })
);
