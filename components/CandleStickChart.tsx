"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from "@/constants";
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { fetcher } from "@/actions/fetcher";
import { convertOHLCData } from "@/lib/utils";

export default function CandleStickChart({
  data,
  coinId,
  height = 360,
  initialPeriod = "daily",
}: CandlestickChartProps) {
  const [period, setPeriod] = useState(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
  const [isPending, startTransition] = useTransition();

  async function fetchOhlcData(selectedPeriod: Period) {
    try {
      const config = PERIOD_CONFIG[selectedPeriod];
      const newData = await fetcher<OHLCData[]>(`coins/${coinId}/ohlc`, {
        vs_currency: "usd",
        days: config.days as string,
        precision: "full",
      });

      setOhlcData(newData ?? []);
    } catch (error) {
      console.log("Failed to fetch OHLC data", error);
    }
  }

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const showTime = ["daily", "weekly", "monthly"].includes(period);

    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });

    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    series.setData(convertOHLCData(ohlcData ?? []));
    chart.timeScale().fitContent();

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [height]);

  useEffect(() => {
    if (!candleSeriesRef.current) return;

    console.log("ohlcData", ohlcData);

    const convertedToSeconds = ohlcData?.map(
      (item) =>
        [
          Math.floor(item[0] / 1000),
          item[1],
          item[2],
          item[3],
          item[4],
        ] as OHLCData,
    );

    const converted = convertOHLCData(convertedToSeconds);
    candleSeriesRef.current.setData(converted);
    chartRef.current?.timeScale().fitContent();
  }, [ohlcData, period]);

  function handlePeriodChange(newPeriod: Period) {
    if (newPeriod === period) return;
    startTransition(async () => {
      setPeriod(newPeriod);
      await fetchOhlcData(newPeriod);
    });
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-1 flex-wrap justify-end">
        {PERIOD_BUTTONS.map((btn) => (
          <Button
            variant={period === btn.value ? "default" : "outline"}
            key={btn.value}
            onClick={() => handlePeriodChange(btn.value)}
            disabled={isPending}
          >
            {btn.label}
          </Button>
        ))}
      </div>
      <div ref={chartContainerRef} style={{ height }} />
    </div>
  );
}
