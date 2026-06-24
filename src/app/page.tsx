import BenPlayer from "@/components/BenPlayer";
import { VideoQualitySource } from "@/components/BenPlayer/types";

interface PageProps {
  searchParams: Promise<{
    title?: string;
    url1080?: string;
    url720?: string;
    url480?: string;
    url360?: string;
    url?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const dynamicTitle = params.title || "Dynamic Multi-Quality Stream";

  const sources: VideoQualitySource[] = [];

  if (params.url) {
    sources.push({ label: "Auto", url: params.url });
  }

  if (params.url1080) sources.push({ label: "1080p", url: params.url1080 });
  if (params.url720) sources.push({ label: "720p", url: params.url720 });
  if (params.url480) sources.push({ label: "480p", url: params.url480 });
  if (params.url360) sources.push({ label: "360p", url: params.url360 });

  if (sources.length === 0) {
    sources.push(
      {
        label: "1080p",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        label: "720p",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      },
    );
  }

  return (
    <main className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-4">
        <BenPlayer sources={sources} title={dynamicTitle} />
      </div>
    </main>
  );
}
