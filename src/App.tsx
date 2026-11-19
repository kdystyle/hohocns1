import { useCallback, useEffect, useRef, useState } from 'react';
import { SizzleAudioEngine } from './audio/sizzleAudio';
import { AdvantagesSection } from './components/AdvantagesSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProfitSimulatorSection } from './components/ProfitSimulatorSection';
import { SampleInquirySection } from './components/SampleInquirySection';
import { SHOWCASE_PHOTOS } from './types/scene';

export default function App() {
  const audioRef = useRef<SizzleAudioEngine | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    const audio = new SizzleAudioEngine();
    audioRef.current = audio;

    return () => {
      audio.dispose();
      audioRef.current = null;
    };
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectPhoto = useCallback((index: number) => {
    const safeIndex = Math.max(0, Math.min(index, SHOWCASE_PHOTOS.length - 1));
    setActivePhotoIndex(safeIndex);
    const photo = SHOWCASE_PHOTOS[safeIndex];
    audioRef.current?.setMode(photo.category);
  }, []);

  const handleInspectRawPhoto = useCallback(() => {
    handleSelectPhoto(2);
    scrollToSection('hero');
  }, [handleSelectPhoto, scrollToSection]);

  const handleInspectCookPhoto = useCallback(() => {
    handleSelectPhoto(0);
    audioRef.current?.triggerFlameBurst();
    scrollToSection('hero');
  }, [handleSelectPhoto, scrollToSection]);

  const handleToggleAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextEnabled = !audioEnabled;
    const active = await audio.setEnabled(nextEnabled);
    setAudioEnabled(active);
  }, [audioEnabled]);

  return (
    <div className="min-h-screen w-full bg-[#0b0b0d] text-stone-100">
      <Navbar onScrollTo={scrollToSection} />

      <main>
        <HeroSection
          activeIndex={activePhotoIndex}
          audioEnabled={audioEnabled}
          onSelectPhoto={handleSelectPhoto}
          onScrollToApply={() => scrollToSection('apply')}
          onToggleAudio={handleToggleAudio}
        />

        <AdvantagesSection
          onInspectRawPhoto={handleInspectRawPhoto}
          onInspectCookPhoto={handleInspectCookPhoto}
        />

        <ProfitSimulatorSection onScrollToApply={() => scrollToSection('apply')} />

        <SampleInquirySection />
      </main>

      <Footer onScrollTo={scrollToSection} />
    </div>
  );
}
