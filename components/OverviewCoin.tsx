import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { fetcher } from "@/actions/fetcher";
import { notFound } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

export default async function OverviewCoin() {
  const coin = await fetcher<CoinDetailsData>("coins/bitcoin");

  if (!coin) {
    return notFound();
  }

  return (
    <Card className="col-span-8">
      <CardHeader className="space-y-4">
        <CardTitle>
          <h2 className="text-primary text-2xl font-semibold">Chart</h2>
        </CardTitle>
        <div className="flex items-center gap-x-2">
          <Image
            src={coin?.image.large}
            alt={coin.name}
            width={56}
            height={56}
          />
          <div>
            <p className="text-sm text-muted-foreground">
              {coin.name} / {coin.symbol.toUpperCase()}
            </p>
            <p className="text-sm text-primary font-bold">
              {formatCurrency(coin.market_data.current_price.usd)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

export function OverviewCoinSkeleton() {
  return (
    <Card className="col-span-8">
      <CardHeader className="space-y-4">
        <Skeleton className="w-28 h-5" />
        <div className="flex items-center gap-x-2">
          <Skeleton className="size-15 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-18 h-4" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
