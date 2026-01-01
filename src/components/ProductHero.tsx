import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Cpu, Wifi, Bot, Play, Pause, Volume2, VolumeX, ChevronDown } from "lucide-react";

const FEATURES = [
  { icon: Zap, label: "60-80W Rapid Charging", description: "Superfast power delivery" },
  { icon: Cpu, label: "Built-in Mining Chips", description: "24/7 Monero mining" },
  { icon: Wifi, label: "Wi-Fi + LoRa Mesh", description: "Decentralized network" },
  { icon: Bot, label: "Eliza AI Coordinator", description: "DAO-powered intelligence" },
];

export const ProductHero = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const attemptAutoplay = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Autoplay blocked by browser. User interaction required.");
        }
      }
    };

    attemptAutoplay();
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToShop = () => {
    document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/media/xmrtcharger.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-center space-y-6 mb-12">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              Revolutionary Technology
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              The World's First Supercharger
              <span className="block text-primary mt-2">That Mines Monero</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Charge your devices at lightning speed while earning cryptocurrency. 
              The XMRT Charger combines cutting-edge power delivery with embedded mining technology.
            </p>

            {/* Audio Player */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={toggleAudio}
                className="gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-5 w-5" />
                    Pause Voiceover
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Listen to Voiceover
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                title={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
            </div>

            <audio ref={audioRef} src="/media/voiceover.mp3" onEnded={() => setIsPlaying(false)} />
          </div>

          {/* Video Card */}
          <Card className="max-w-4xl mx-auto mb-12 overflow-hidden border-2 border-primary/20 corporate-shadow-lg">
            <CardContent className="p-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-video object-cover"
              >
                <source src="/media/xmrtcharger.mp4" type="video/mp4" />
              </video>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {FEATURES.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
              >
                <CardContent className="p-4 text-center space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {feature.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={scrollToShop}
              className="gap-2 text-lg px-8"
            >
              <Zap className="h-5 w-5" />
              Shop Now
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
