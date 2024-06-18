import { create } from 'zustand';

const useSeatStore = create((set) => ({
  seats: [],
  setSeats: (newSeats) => set({ seats: newSeats }),
}));

export default useSeatStore;