import { fetcher } from "@/actions/fetcher";
import { cn, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default async function TrendingCoins() {
  const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
    "search/trending",
    undefined,
    300,
  );

  if (!trendingCoins) {
    return notFound();
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>
          <h2 className="text-primary text-2xl font-semibold">Top Movers</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-120 overflow-y-auto scrollbar-none space-y-3">
        {trendingCoins.coins.map((coin) => {
          const isTrendingUp =
            coin.item.data.price_change_percentage_24h.usd > 0;
          const isTrendingDown =
            coin.item.data.price_change_percentage_24h.usd < 0;
          return (
            <Link
              href={`/coins/${coin.item.id}`}
              key={coin.item.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 flex-1">
                <Image
                  src={coin.item.large}
                  alt={coin.item.name}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-md font-bold">{coin.item.symbol}</span>
                  <span className="text-sm text-muted-foreground">
                    {coin.item.name}
                  </span>
                </div>
              </div>
              <div className="flex-1 text-center">
                <span
                  className={cn(
                    isTrendingUp
                      ? "text-green-500"
                      : isTrendingDown
                        ? "text-red-500"
                        : "text-accent-foreground",
                  )}
                >
                  {Math.abs(
                    coin.item.data.price_change_percentage_24h.usd,
                  ).toFixed(2)}
                  %
                </span>
              </div>
              <div className="flex-1 text-end">
                <span>{formatCurrency(coin.item.data.price)}</span>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function TrendingCoinsSkeleton() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <Skeleton className="w-32 h-6" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(8)].map((_item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Skeleton className="rounded-full size-12" />
              <Skeleton className="w-14 h-5" />
            </div>
            <Skeleton className="w-18 h-5" />
            <Skeleton className="w-18 h-5" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
