import HeroBanner from "@/components/home/HeroBanner";
import MarketplaceHighlights from "@/components/home/MarketplaceHighlights";
import HomepageExtraSections from "@/components/home/HomepageExtraSections";

export default function Home() {
  return (
    <div className="w-full">
      <HeroBanner />
      <MarketplaceHighlights />
      <HomepageExtraSections />
    </div>
  );
}
