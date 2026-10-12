import { create } from 'zustand';
import { useEffect, useState } from 'react';

// Cross-page state for the Muslim Corner. Each tool now lives at its own real
// route (`/muslim/prayer|quran|radio`), so there is no `view` here anymore —
// only state that has to outlive a route change (open modals, the reader jump
// target, focus mode, and the radio sleep timer).
interface MuslimNavState {
  /** Saved-bookmarks modal visibility (navbar button + reader top row). */
  bookmarksOpen: boolean;
  setBookmarksOpen: (open: boolean) => void;
  /** Roznama settings modal visibility (navbar gear on /roznama). */
  roznamaSettingsOpen: boolean;
  setRoznamaSettingsOpen: (open: boolean) => void;
  /** Muslim prayer settings dialog (navbar gear on /muslim/prayer). */
  muslimPrayerSettingsOpen: boolean;
  setMuslimPrayerSettingsOpen: (open: boolean) => void;
  /** Homepage settings dialog (navbar gear instead of hamburger on /). */
  homeSettingsOpen: boolean;
  setHomeSettingsOpen: (open: boolean) => void;
  /** "surah:ayah" to land on after jumping from a bookmark or the radio. */
  targetAyah: string | null;
  setTargetAyah: (key: string | null) => void;
  /** Quran reader focus mode — hides navbar + chrome to enlarge text. */
  quranFocus: boolean;
  setQuranFocus: (focus: boolean) => void;
  /**
   * Radio sleep timer: the epoch ms at which playback stops, or null for
   * endless. It lives here rather than in the applet so the countdown keeps
   * running while the user reads the Quran or checks prayer times.
   */
  radioSleepUntil: number | null;
  setRadioSleepUntil: (until: number | null) => void;
}

export const useMuslimNav = create<MuslimNavState>((set) => ({
  bookmarksOpen: false,
  setBookmarksOpen: (bookmarksOpen) => set({ bookmarksOpen }),
  roznamaSettingsOpen: false,
  setRoznamaSettingsOpen: (roznamaSettingsOpen) => set({ roznamaSettingsOpen }),
  muslimPrayerSettingsOpen: false,
  setMuslimPrayerSettingsOpen: (muslimPrayerSettingsOpen) => set({ muslimPrayerSettingsOpen }),
  homeSettingsOpen: false,
  setHomeSettingsOpen: (homeSettingsOpen) => set({ homeSettingsOpen }),
  targetAyah: null,
  setTargetAyah: (targetAyah) => set({ targetAyah }),
  quranFocus: false,
  setQuranFocus: (quranFocus) => set({ quranFocus }),
  radioSleepUntil: null,
  setRadioSleepUntil: (radioSleepUntil) => set({ radioSleepUntil }),
}));

/** Mobile breakpoint mirror (matches Tailwind's max-sm) for picking
 *  Sheet-bottom vs Dialog-center settings containers. */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return mobile;
}
