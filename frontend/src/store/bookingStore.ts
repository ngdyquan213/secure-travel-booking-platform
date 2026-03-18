import { create } from 'zustand';

export interface SearchParams {
  type: 'flight' | 'hotel' | 'tour';
  departure?: string;
  arrival?: string;
  checkIn?: string;
  checkOut?: string;
  destination?: string;
  travelers?: number;
  rooms?: number;
  class?: 'economy' | 'business' | 'first';
}

export interface BookingItem {
  id: string;
  type: 'flight' | 'hotel' | 'tour';
  title: string;
  price: number;
  image?: string;
}

interface BookingState {
  searchParams: SearchParams;
  selectedItems: BookingItem[];
  currentBooking: any;
  
  // Actions
  setSearchParams: (params: Partial<SearchParams>) => void;
  addToBooking: (item: BookingItem) => void;
  removeFromBooking: (id: string) => void;
  clearBooking: () => void;
  setCurrentBooking: (booking: any) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  searchParams: {
    type: 'flight',
    travelers: 1,
    rooms: 1,
    class: 'economy',
  },
  selectedItems: [],
  currentBooking: null,

  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),

  addToBooking: (item) =>
    set((state) => ({
      selectedItems: [...state.selectedItems, item],
    })),

  removeFromBooking: (id) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((item) => item.id !== id),
    })),

  clearBooking: () =>
    set({
      selectedItems: [],
      currentBooking: null,
    }),

  setCurrentBooking: (booking) =>
    set({ currentBooking: booking }),
}));
