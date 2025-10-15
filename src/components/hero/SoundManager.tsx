import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SoundManagerProps {
  onRewardEarned?: boolean;
}

export const SoundManager = ({ onRewardEarned }: SoundManagerProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Audio API
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  useEffect(() => {
    if (onRewardEarned && !isMuted && audioContextRef.current) {
      playChaChing();
    }
  }, [onRewardEarned, isMuted]);

  const playChaChing = () => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Create oscillator for "cha" sound
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.frequency.setValueAtTime(880, now); // A5
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.1); // E6
    
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc1.start(now);
    osc1.stop(now + 0.15);

    // Create oscillator for "ching" sound
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    osc2.frequency.setValueAtTime(1320, now + 0.15); // E6
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.25); // A6
    
    gain2.gain.setValueAtTime(0.3, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc2.start(now + 0.15);
    osc2.stop(now + 0.4);

    // Add a subtle bell-like overtone
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    
    osc3.frequency.setValueAtTime(2640, now + 0.15); // High harmonic
    
    gain3.gain.setValueAtTime(0.1, now + 0.15);
    gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    osc3.start(now + 0.15);
    osc3.stop(now + 0.5);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsMuted(!isMuted)}
      className="fixed top-4 right-4 z-50"
      title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </Button>
  );
};
