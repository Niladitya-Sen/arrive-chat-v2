"use client";

import { create } from 'zustand';

type CaptainRoomSidebarState = {
    isOpen: boolean;
    toggle: () => void;
};

export const useCaptainRoomSidebar = create<CaptainRoomSidebarState>(
    (set) => ({
        isOpen: false,
        toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    })
);
