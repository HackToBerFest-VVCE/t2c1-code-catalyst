import { NextResponse } from "next/server";

// Fallback rates if external APIs are unreachable
const DEFAULT_RATES: Record<string, number> = {
  USD: 1,
  INR: 94.94,
  EUR: 0.893,
  GBP: 0.748,
  JPY: 156.8,
  AED: 3.672,
  SOL: 0.00984, // ~101.6 USD per SOL
};

const DEFAULT_SOL_PRICES: Record<string, number> = {
  USD: 101.64,
  INR: 9650.32,
  EUR: 90.72,
  GBP: 76.00,
  JPY: 15943.68,
  AED: 373.27,
  SOL: 1,
};

let cachedData: {
  rates: Record<string, number>;
  solInCurrencies: Record<string, number>;
  timestamp: number;
} | null = null;

const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

export async function GET() {
  const now = Date.now();
  if (cachedData && now - cachedData.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({ ...cachedData, source: "cache" });
  }

  try {
    // 1. Fetch live SOL price against fiats from CoinGecko
    const cgRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,inr,eur,gbp,jpy,aed",
      { next: { revalidate: 60 } }
    );
    const cgData = await cgRes.json();

    const solUsd = cgData?.solana?.usd || DEFAULT_SOL_PRICES.USD;
    const solInr = cgData?.solana?.inr || DEFAULT_SOL_PRICES.INR;
    const solEur = cgData?.solana?.eur || DEFAULT_SOL_PRICES.EUR;
    const solGbp = cgData?.solana?.gbp || DEFAULT_SOL_PRICES.GBP;
    const solJpy = cgData?.solana?.jpy || DEFAULT_SOL_PRICES.JPY;
    const solAed = cgData?.solana?.aed || DEFAULT_SOL_PRICES.AED;

    const solInCurrencies: Record<string, number> = {
      USD: solUsd,
      INR: solInr,
      EUR: solEur,
      GBP: solGbp,
      JPY: solJpy,
      AED: solAed,
      SOL: 1,
    };

    // Derived 1 USD rates
    const inrPerUsd = solInr / solUsd;
    const eurPerUsd = solEur / solUsd;
    const gbpPerUsd = solGbp / solUsd;
    const jpyPerUsd = solJpy / solUsd;
    const aedPerUsd = solAed / solUsd;
    const solPerUsd = 1 / solUsd;

    const rates: Record<string, number> = {
      USD: 1,
      INR: Number(inrPerUsd.toFixed(2)),
      EUR: Number(eurPerUsd.toFixed(4)),
      GBP: Number(gbpPerUsd.toFixed(4)),
      JPY: Number(jpyPerUsd.toFixed(2)),
      AED: Number(aedPerUsd.toFixed(3)),
      SOL: Number(solPerUsd.toFixed(6)),
    };

    cachedData = {
      rates,
      solInCurrencies,
      timestamp: now,
    };

    return NextResponse.json({
      rates,
      solInCurrencies,
      timestamp: now,
      source: "CoinGecko Live API",
    });
  } catch (error) {
    // Return gracefully with default accurate benchmarks
    return NextResponse.json({
      rates: DEFAULT_RATES,
      solInCurrencies: DEFAULT_SOL_PRICES,
      timestamp: now,
      source: "fallback",
    });
  }
}
