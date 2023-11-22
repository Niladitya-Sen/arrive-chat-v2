import { create } from 'zustand';
import { services as data } from '@/lib/services';
import { produce } from "immer";

type ServiceType = {
    id: string;
    title: string;
    image: string;
    link: string;
}

type ServicesStoreType = {
    services: ServiceType[];
    setServices: (services: string[]) => void;
    resetServices: () => void;
};

type RoomStoreType = {
    rooms: string[];
    setRooms: (newRooms: string[]) => void;
    resetRooms: () => void;
};

export const useServicesStore = create<ServicesStoreType>((set) => ({
    services: data,
    setServices: (services) => set(
        produce<ServicesStoreType>((state) => {
            state.services = data;
            state.services = services.map((service) => {
                return state.services.find((s) => s.id === service) as ServiceType;
            });
        })
    ),
    resetServices: () => set(
        produce<ServicesStoreType>((state) => {
            state.services = data;
        })
    ),
}));

export const useRoomStore = create<RoomStoreType>((set) => ({
    rooms: [],
    setRooms: (newRooms) => set(
        produce<RoomStoreType>((state) => {
            state.rooms = newRooms;
        })
    ),
    resetRooms: () => set(
        produce<RoomStoreType>((state) => {
            state.rooms = [];
        })
    ),
}));
