import { NextResponse } from "next/server";

// Scam pattern database for tourism contexts
const SCAM_PATTERNS = [
  {
    pattern: /government.{0,30}(authoris|authorized|official)/i,
    flag: "Claims government or official authorization — actual government guides display ID and work from official counters only.",
    weight: 2,
  },
  {
    pattern: /(free|complimentary).{0,30}(hotel|accommodation|stay|tour|ride)/i,
    flag: "Offer of free accommodation or tour — typically used to bring tourists to commission shops.",
    weight: 2,
  },
  {
    pattern: /upfront|pay.{0,20}(now|first|before|advance)/i,
    flag: "Request for upfront payment — reputable services issue receipts and collect payment after service.",
    weight: 2,
  },
  {
    pattern: /(special|exclusive|today only|limited time)/i,
    flag: "Artificial urgency (special deal, today only) — a common pressure tactic.",
    weight: 1,
  },
  {
    pattern: /(gem|jewel|stone|carpet|silk|factory).{0,40}(buy|purchase|discount|export)/i,
    flag: "Gem, carpet, or factory 'export deal' — one of the most reported tourist scams in India.",
    weight: 3,
  },
  {
    pattern: /festival.{0,30}(discount|special|cheaper)/i,
    flag: "Festival discount story — prices are not actually discounted.",
    weight: 2,
  },
  {
    pattern: /closed.{0,40}(palace|monument|museum|temple)/i,
    flag: "Claims a landmark is closed — often used to redirect to alternative shops.",
    weight: 3,
  },
  {
    pattern: /(my|our).{0,20}(uncle|brother|cousin|friend).{0,30}(shop|store|hotel)/i,
    flag: "Family shop redirect — driver or guide offers to take you to a relative's shop.",
    weight: 2,
  },
  {
    pattern: /(change|exchange).{0,20}(money|currency)/i,
    flag: "Informal money exchange — always use bank ATMs or official exchange bureaus.",
    weight: 2,
  },
  {
    pattern: /help.{0,30}carry.{0,30}(bag|package|parcel)/i,
    flag: "Offer to carry parcels across borders — serious legal risk regardless of claimed legitimacy.",
    weight: 3,
  },
  {
    pattern: /very cheap|cheapest|best price guarantee/i,
    flag: "Extreme pricing claims — verify independently before committing.",
    weight: 1,
  },
];

const GENERAL_ADVICE = [
  "Book tours and guides through your hotel or official tourism counters where staff are accountable.",
  "Always ask for a written receipt with the service provider's name and contact details.",
  "Verify any official credentials shown — licensed guides carry government-issued photo ID cards.",
  "Use pre-paid taxi or auto-rickshaw counters at airports and stations to avoid fare disputes.",
  "Do not hand over your passport or credit card unless at a hotel front desk or official transaction.",
];

export async function POST(request: Request) {
  try {
    const body = await request.json() as { text?: string };
    const { text = "" } = body;

    if (!text.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const matched = SCAM_PATTERNS.filter((p) => p.pattern.test(text));
    const rawScore = matched.reduce((s, p) => s + p.weight, 0);
    const riskScore = Math.min(Math.round((rawScore / 8) * 10), 10);

    let riskLevel: "low" | "medium" | "high";
    if (riskScore >= 6) riskLevel = "high";
    else if (riskScore >= 3) riskLevel = "medium";
    else riskLevel = "low";

    const flags = matched.map((p) => p.flag);
    const advice =
      matched.length > 0
        ? [
            "Ask for official identification before accepting any guided service.",
            "Do not proceed with this offer without independent verification.",
            ...GENERAL_ADVICE.slice(0, 2),
          ]
        : [
            "No common scam patterns detected, but always stay cautious.",
            ...GENERAL_ADVICE.slice(0, 3),
          ];

    return NextResponse.json({
      result: {
        riskLevel,
        riskScore,
        flags,
        advice,
        disclaimer:
          "This analysis is based on pattern matching against common tourist scam scenarios. It is AI-generated risk guidance, not legal advice. A low risk score does not mean an offer is safe — exercise independent judgement and report suspicious activity to local police or tourist helplines.",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Scam analysis failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 400 }
    );
  }
}
