import HeroBanner from "@/components/home/HeroBanner";
import MarketplaceHighlights from "@/components/home/MarketplaceHighlights";

export default function Home() {
  return (
    <div className="w-full">
      <HeroBanner />
      <MarketplaceHighlights />
    </div>
  );
}
