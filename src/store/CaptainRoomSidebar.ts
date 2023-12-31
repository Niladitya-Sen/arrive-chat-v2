"use client";

import { create } from 'zustand';

type CaptainRoomSidebarState = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

export const useCaptainRoomSidebar = create<CaptainRoomSidebarState>(
    (set) => ({
        isOpen: false,
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
    })
);
