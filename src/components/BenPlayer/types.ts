export interface VideoQualitySource {
  label: "1080p" | "720p" | "480p" | "360p" | "Auto";
  url: string;
}

export interface BenPlayerProps {
  sources: VideoQualitySource[];
  poster?: string;
  title?: string;
}
