import { Suspense } from "react";
import TrendingCoins, {
  TrendingCoinsSkeleton,
} from "@/components/TrendingCoins";
import OverviewCoin, { OverviewCoinSkeleton } from "@/components/OverviewCoin";
import TopCategories from "@/components/TopCategories";

export default async function Home() {
  return (
    <section className="mt-10 space-y-5">
      <div className="grid grid-cols-12 gap-4">
        <Suspense fallback={<OverviewCoinSkeleton />}>
          <OverviewCoin />
        </Suspense>
        <Suspense fallback={<TrendingCoinsSkeleton />}>
          <TrendingCoins />
        </Suspense>
      </div>
      <Suspense fallback={<div>Loading TopCategories...</div>}>
        <TopCategories />
      </Suspense>
    </section>
  );
}
