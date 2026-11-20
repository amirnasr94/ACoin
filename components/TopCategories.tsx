import { fetcher } from "@/actions/fetcher";
import { notFound } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export default async function TopCategories() {
  const topCategories = await fetcher<Category[]>("coins/categories").then(
    (res) => res?.slice(0, 10) || [],
  );

  if (!topCategories) {
    return notFound();
  }

  console.log("topCategories", topCategories);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Top Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Top Gainers</TableHead>
              <TableHead>24h Change</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead>24h Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCategories.map((topCategory) => {
              const isTrendingUp = topCategory.market_cap_change_24h > 0;
              const isTrendingDown = topCategory.market_cap_change_24h < 0;
              return (
                <TableRow key={topCategory.name}>
                  <TableCell>{topCategory.name}</TableCell>
                  <TableCell className="flex items-center gap-x-2">
                    {topCategory.top_3_coins.map((coin) => (
                      <Image
                        key={coin}
                        src={coin}
                        alt=""
                        width={36}
                        height={36}
                      />
                    ))}
                  </TableCell>
                  <TableCell
                    className={cn(
                      isTrendingUp
                        ? "text-green-500"
                        : isTrendingDown
                          ? "text-red-500"
                          : "text-accent-foreground",
                    )}
                  >
                    {isTrendingUp && <TrendingUp size={18} />}
                    {isTrendingDown && <TrendingDown size={18} />}
                    {formatCurrency(topCategory.market_cap_change_24h)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(topCategory.market_cap)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(topCategory.volume_24h)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
