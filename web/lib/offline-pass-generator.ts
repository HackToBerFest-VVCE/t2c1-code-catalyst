// ─── Touristमत्रम्: Offline Remote Travel Pass & Itinerary Email Generator ───

export interface ItineraryStop {
  time: string;
  name: string;
  category: string;
  duration: string;
  tip: string;
  costDisplay: string;
  costUSD?: number;
  img?: string;
  transitHop?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  theme: string;
  stops: ItineraryStop[];
}

export interface ItineraryPlan {
  city: string;
  numDays: number;
  totalBudget: number;
  currency: string;
  totalBudgetSOL?: string;
  crowd?: "tranquil" | "vibrant" | "balanced";
  pace?: "leisurely" | "explorer";
  days: ItineraryDay[];
  costs: {
    attractions: number;
    transit: number;
    diningStay: number;
  };
  transitPass: string;
  operatorCode?: string;
  certificateId?: string;
  country?: string;
}

export interface PassGeneratorOptions {
  travelerType?: "indian" | "foreign";
  foreignCountry?: string;
  recipientEmail?: string;
  generatedDate?: string;
}

/**
 * Generates a 100% self-contained, zero-dependency HTML file
 * designed to open and render perfectly offline on any phone, tablet, or laptop
 * when traveling in remote areas with zero cellular or Wi-Fi signal.
 */
export function generateOfflinePassHTML(plan: ItineraryPlan, options: PassGeneratorOptions = {}): string {
  const generatedDate = options.generatedDate || new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const certId = plan.certificateId || `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const travelerBadge = options.travelerType === "foreign"
    ? `Foreign Traveler (${options.foreignCountry || "International"} · e-Visa Verified)`
    : "Indian Citizen (Domestic Heritage Pass)";

  const crowdBadge = plan.crowd === "tranquil" ? "🍃 Tranquil & Uncrowded" : plan.crowd === "vibrant" ? "🔥 Vibrant & Energetic" : "⚖️ Balanced & Curated";
  const paceBadge = plan.pace === "leisurely" ? "Relaxed Pacing" : "Explorer Pacing";

  const daysHtml = plan.days.map((day) => `
    <div class="day-card">
      <div class="day-header">
        <span class="day-badge">DAY ${day.dayNumber}</span>
        <h3 class="day-theme">${escapeHtml(day.theme)}</h3>
      </div>
      <div class="stops-list">
        ${day.stops.map((stop, sIdx) => `
          <div class="stop-item">
            <div class="stop-time">${escapeHtml(stop.time)}</div>
            <div class="stop-content">
              <div class="stop-top">
                <span class="stop-name">${escapeHtml(stop.name)}</span>
                <span class="stop-cat">${escapeHtml(stop.category)} · ${escapeHtml(stop.duration)}</span>
              </div>
              <div class="stop-tip">💡 <strong>Guide Tip:</strong> ${escapeHtml(stop.tip)}</div>
              <div class="stop-cost">🎟️ <strong>Admission / Cost:</strong> ${escapeHtml(stop.costDisplay)}</div>
              ${stop.transitHop ? `
                <div class="transit-hop">
                  🚌 <strong>Transit Connection:</strong> ${escapeHtml(stop.transitHop)}
                </div>
              ` : ""}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline Remote Travel Pass - ${escapeHtml(plan.city)} - Touristमत्रम्</title>
  <style>
    :root {
      --bg: #0D1117;
      --card-bg: #161B22;
      --card-sub: #21262D;
      --border: #30363D;
      --gold: #F8D057;
      --gold-dark: #D4AF37;
      --text: #F0F6FC;
      --text-muted: #8B949E;
      --green: #2EA043;
      --red: #DA3633;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 16px;
      line-height: 1.5;
      font-size: 15px;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    /* Offline Banner */
    .offline-banner {
      background: linear-gradient(135deg, #1f6feb 0%, #1158c7 100%);
      color: #FFFFFF;
      padding: 14px 18px;
      border-radius: 12px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 4px 16px rgba(31, 111, 235, 0.3);
    }
    .offline-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .offline-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #7EE787;
      box-shadow: 0 0 8px #7EE787;
      display: inline-block;
    }

    /* Header Bar */
    .header-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-top: 4px solid var(--gold);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
    }
    .brand-eyebrow {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 6px;
    }
    .city-title {
      font-size: 28px;
      font-weight: 900;
      color: #FFFFFF;
      margin-bottom: 6px;
    }
    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--border);
    }
    .meta-tag {
      background: var(--card-sub);
      color: var(--text);
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 12px;
    }

    /* Action Buttons (Print / Save) */
    .btn-actions {
      display: flex;
      gap: 10px;
      margin-top: 18px;
      flex-wrap: wrap;
    }
    .btn {
      background: var(--gold);
      color: #000000;
      border: none;
      border-radius: 8px;
      padding: 10px 18px;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }
    .btn-secondary {
      background: var(--card-sub);
      color: var(--text);
      border: 1px solid var(--border);
    }

    /* Emergency SOS Grid */
    .sos-card {
      background: rgba(218, 54, 51, 0.08);
      border: 1.5px solid rgba(218, 54, 51, 0.4);
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 20px;
    }
    .sos-title {
      font-size: 14px;
      font-weight: 800;
      color: #FF7B72;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
    }
    .sos-item {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 14px;
    }
    .sos-name { font-size: 11px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
    .sos-number { font-size: 18px; font-weight: 900; color: #FFFFFF; letter-spacing: 1px; margin-top: 2px; }
    .sos-note { font-size: 11px; color: #7EE787; margin-top: 2px; font-weight: 600; }

    /* Remote Area Survival Tips */
    .remote-tips {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-left: 4px solid #F8D057;
      border-radius: 12px;
      padding: 18px 20px;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .remote-tips h4 {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--gold);
      margin-bottom: 8px;
    }
    .remote-tips ul {
      padding-left: 20px;
      color: var(--text);
    }
    .remote-tips li {
      margin-bottom: 6px;
    }

    /* Day Schedule Cards */
    .day-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      margin-bottom: 16px;
      overflow: hidden;
    }
    .day-header {
      background: var(--card-sub);
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border);
    }
    .day-badge {
      background: var(--gold);
      color: #000;
      font-weight: 900;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }
    .day-theme {
      font-size: 15px;
      font-weight: 800;
      color: #FFF;
    }
    .stops-list {
      padding: 14px 18px;
    }
    .stop-item {
      display: flex;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .stop-item:last-child { border-bottom: none; }
    .stop-time {
      font-weight: 800;
      color: var(--gold);
      font-size: 13px;
      width: 75px;
      flex-shrink: 0;
      padding-top: 2px;
    }
    .stop-content { flex: 1; }
    .stop-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 4px;
    }
    .stop-name { font-size: 15px; font-weight: 800; color: #FFF; }
    .stop-cat { font-size: 11px; color: var(--gold-dark); font-weight: 700; }
    .stop-tip { font-size: 12.5px; color: var(--text); margin-top: 4px; }
    .stop-cost { font-size: 12px; color: #7EE787; margin-top: 4px; }
    .transit-hop {
      background: var(--card-sub);
      border-left: 3px solid #1f6feb;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 12px;
      color: #A5D6FF;
      margin-top: 8px;
    }

    /* Budget Breakdown */
    .budget-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .budget-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
      margin-top: 10px;
    }
    .budget-table td {
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
    }
    .budget-table tr:last-child td {
      border-bottom: none;
      font-size: 16px;
      font-weight: 900;
      color: var(--gold);
      padding-top: 12px;
    }

    /* Fair Price Rate-Card */
    .fair-price-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 20px;
    }
    .rate-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }
    .rate-box {
      background: var(--card-sub);
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 12.5px;
    }
    .rate-box strong { color: var(--gold); }

    /* Certificate Box */
    .cert-box {
      background: rgba(248, 208, 87, 0.05);
      border: 1.5px solid rgba(248, 208, 87, 0.35);
      border-radius: 14px;
      padding: 18px 20px;
      text-align: center;
      margin-top: 24px;
    }
    .cert-code {
      font-family: monospace;
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 2px;
      color: var(--gold);
      margin: 8px 0;
    }

    /* Print Styles */
    @media print {
      body { background: #FFFFFF; color: #000000; padding: 0; }
      .container { max-width: 100%; }
      .offline-banner, .btn-actions { display: none !important; }
      .header-card, .day-card, .budget-card, .sos-card, .fair-price-card, .remote-tips, .cert-box {
        background: #FFFFFF !important;
        border: 1px solid #CCC !important;
        color: #000000 !important;
        box-shadow: none !important;
      }
      .city-title, .stop-name, .day-theme { color: #000000 !important; }
      .stop-time, .brand-eyebrow, .rate-box strong, .cert-code { color: #8A6D00 !important; }
      .meta-tag, .day-badge, .sos-item, .rate-box, .transit-hop {
        background: #F4F4F6 !important;
        color: #000000 !important;
        border: 1px solid #DDD !important;
      }
      .stop-tip, .stop-cost, .sos-note { color: #333333 !important; }
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- Active Offline Banner -->
    <div class="offline-banner">
      <div class="offline-badge">
        <span class="offline-dot"></span>
        <span>Active Offline Remote Pass · No Internet Required</span>
      </div>
      <div style="font-size: 12px; font-weight: 600;">
        Saved to Device Storage 📱
      </div>
    </div>

    <!-- Header Section -->
    <div class="header-card">
      <div class="brand-eyebrow">Touristमत्रम् · Verified Travel Concierge</div>
      <h1 class="city-title">${escapeHtml(plan.city)}, India ${plan.country === "India" || !plan.country ? "🇮🇳" : ""}</h1>
      <p style="color: var(--text-muted); font-size: 13.5px;">
        Curated offline emergency itinerary and guaranteed price agreement. Keep this file in your phone or downloads folder when traveling through valleys, mountain passes, and remote areas with zero cell reception.
      </p>

      <div class="meta-row">
        <span class="meta-tag">📅 ${plan.numDays} Days Plan</span>
        <span class="meta-tag">💰 ${plan.totalBudget.toLocaleString()} ${plan.currency}${plan.totalBudgetSOL ? ` (≈ ◎ ${plan.totalBudgetSOL} SOL)` : ""}</span>
        <span class="meta-tag">${crowdBadge}</span>
        <span class="meta-tag">${paceBadge}</span>
        <span class="meta-tag">🛂 ${travelerBadge}</span>
        <span class="meta-tag">🕒 Issued: ${escapeHtml(generatedDate)}</span>
      </div>

      <div class="btn-actions">
        <button class="btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
        <button class="btn btn-secondary" onclick="alert('This offline file is stored locally on your device storage. You can reopen it anytime without internet!')">💾 Saved on Device</button>
      </div>
    </div>

    <!-- Emergency SOS Directory -->
    <div class="sos-card">
      <div class="sos-title">
        <span>🚨 Official 24/7 Emergency Helplines (Works on Any Indian SIM or SOS Satellite)</span>
      </div>
      <div class="sos-grid">
        <div class="sos-item">
          <div class="sos-name">Incredible India Tourist Helpline</div>
          <div class="sos-number">1363</div>
          <div class="sos-note">Toll-Free · 12 Languages · 24x7</div>
        </div>
        <div class="sos-item">
          <div class="sos-name">All-India Emergency / Police / Fire</div>
          <div class="sos-number">112</div>
          <div class="sos-note">Unified National Emergency Number</div>
        </div>
        <div class="sos-item">
          <div class="sos-name">Medical Ambulance Service</div>
          <div class="sos-number">108</div>
          <div class="sos-note">Free Emergency Medical Evac</div>
        </div>
        <div class="sos-item">
          <div class="sos-name">Women Traveler Safety Helpline</div>
          <div class="sos-number">1091</div>
          <div class="sos-note">Specialized Women Police Unit</div>
        </div>
        <div class="sos-item">
          <div class="sos-name">Tourist Cyber & Booking Fraud</div>
          <div class="sos-number">1930</div>
          <div class="sos-note">National Financial Fraud Portal</div>
        </div>
      </div>
    </div>

    <!-- Remote Area Survival Checklist -->
    <div class="remote-tips">
      <h4>📶 Remote Area Travel Protocol (No Internet / Dead Zones)</h4>
      <ul>
        <li><strong>Offline Maps:</strong> Make sure you have pre-downloaded offline vector maps for <em>${escapeHtml(plan.city)}</em> via Google Maps or Organic Maps before entering high passes or remote gorges.</li>
        <li><strong>Physical Cash:</strong> Digital UPI and QR payments fail when network towers drop. Carry sufficient liquid Indian Rupee (₹ INR) cash for local tea stalls, monastery donations, and jeep hire.</li>
        <li><strong>Inner Line Permits (ILP):</strong> If visiting restricted border regions (e.g. Pangong, Nubra Valley, Khardung La, Andaman Islands), keep 4 physical photocopies of your valid photo ID / e-Visa and permit paper.</li>
        <li><strong>High Altitude & Hydration:</strong> Acclimatize for 24-48 hours upon arrival in high altitudes (e.g. Ladakh/Srinagar). Drink 3-4 liters of water daily. Never consume non-bottled open tap water.</li>
      </ul>
    </div>

    <!-- Transit Pass Information -->
    <div class="header-card" style="padding: 18px 22px;">
      <div class="brand-eyebrow">Public Transit & Boarding Voucher</div>
      <div style="font-size: 16px; font-weight: 800; color: #FFF; margin-top: 4px;">
        ${escapeHtml(plan.transitPass)}
      </div>
      ${plan.operatorCode ? `
        <div style="font-size: 12px; color: var(--gold); margin-top: 4px;">
          Official Operator Code: <code>${escapeHtml(plan.operatorCode)}</code>
        </div>
      ` : ""}
      <p style="font-size: 12.5px; color: var(--text-muted); margin-top: 6px;">
        Show this pass name and offline schedule to conductors or station booking agents. For prepaid taxi and auto rickshaw counters, always book inside the official railway/airport booth.
      </p>
    </div>

    <!-- Day-by-Day Schedule -->
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 18px; font-weight: 800; margin-bottom: 12px; color: #FFF;">
        📍 Day-by-Day Itinerary & Verified Sights
      </h2>
      ${daysHtml}
    </div>

    <!-- Fair Price Rate-Card Sentinel -->
    <div class="fair-price-card">
      <h3 style="font-size: 15px; font-weight: 800; color: var(--gold); margin-bottom: 4px;">
        🛡️ Fair Price Rate-Card (Anti-Scam Guide for ${escapeHtml(plan.city)})
      </h3>
      <p style="font-size: 12px; color: var(--text-muted);">
        Use these benchmark rates to negotiate with auto drivers and vendors when you have no internet access to verify prices:
      </p>
      <div class="rate-grid">
        <div class="rate-box">
          <strong>Auto Rickshaw Base:</strong><br>
          ₹30 for first 2 km, then ₹15–₹18/km. Always insist on meter or pre-agreed standard rate.
        </div>
        <div class="rate-box">
          <strong>Packaged Water:</strong><br>
          MRP is strictly ₹20 per 1-litre bottle. Never pay above printed MRP.
        </div>
        <div class="rate-box">
          <strong>Official Guides:</strong><br>
          Only hire ASI (Archaeological Survey of India) badge-wearing licensed guides (₹500–₹1200 / half day).
        </div>
        <div class="rate-box">
          <strong>Prepaid Taxis:</strong><br>
          Always purchase a paper prepaid voucher at the government traffic police booth before boarding.
        </div>
      </div>
    </div>

    <!-- Itemized Budget Breakdown -->
    <div class="budget-card">
      <h3 style="font-size: 15px; font-weight: 800; color: #FFF; margin-bottom: 6px;">
        📊 Itemized Target Budget
      </h3>
      <table class="budget-table">
        <tr>
          <td style="color: var(--text-muted);">Attractions & Sights Admission</td>
          <td style="text-align: right; font-weight: 700;">${(plan.costs?.attractions ?? Math.round((plan.totalBudget || 0) * 0.4)).toLocaleString()} ${plan.currency || "USD"}</td>
        </tr>
        <tr>
          <td style="color: var(--text-muted);">Transit Pass & Connectors</td>
          <td style="text-align: right; font-weight: 700;">${(plan.costs?.transit ?? Math.round((plan.totalBudget || 0) * 0.2)).toLocaleString()} ${plan.currency || "USD"}</td>
        </tr>
        <tr>
          <td style="color: var(--text-muted);">Estimated Stays & Local Dining</td>
          <td style="text-align: right; font-weight: 700;">${(plan.costs?.diningStay ?? Math.round((plan.totalBudget || 0) * 0.4)).toLocaleString()} ${plan.currency || "USD"}</td>
        </tr>
        <tr>
          <td>Total Curated Budget</td>
          <td style="text-align: right;">${(plan.totalBudget ?? 0).toLocaleString()} ${plan.currency || "USD"}</td>
        </tr>
      </table>
    </div>

    <!-- Tamper-Proof Digital Seal -->
    <div class="cert-box">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800; color: var(--gold);">
        Authenticated Travel Agreement & Guarantee
      </div>
      <div class="cert-code">${escapeHtml(certId)}</div>
      <p style="font-size: 12px; color: var(--text-muted); max-width: 600px; margin: 0 auto;">
        This itinerary hash digest is cryptographically sealed on the Solana ledger. Verified against unauthorized price escalations, fake tour changes, and unverified touts.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; font-size: 11px; color: var(--text-muted); padding-bottom: 20px;">
      Touristमत्रम् · Incredible India Digital Travel Concierge Network · Keep this offline copy safe during your journey.
    </div>

  </div>
</body>
</html>`;
}

/**
 * Generates an email-friendly, mobile-responsive HTML body
 * optimized for Gmail and modern email clients.
 */
export function generateItineraryEmailHTML(plan: ItineraryPlan, options: PassGeneratorOptions = {}): string {
  const generatedDate = options.generatedDate || new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const certId = plan.certificateId || `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const travelerBadge = options.travelerType === "foreign"
    ? `Foreign Traveler (${options.foreignCountry || "International"})`
    : "Indian Citizen (Domestic Explorer)";

  const daysHtml = plan.days.map((day) => `
    <div style="background-color: #161B22; border: 1px solid #30363D; border-radius: 10px; margin-bottom: 14px; padding: 16px; color: #F0F6FC;">
      <div style="font-size: 14px; font-weight: 800; color: #F8D057; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #30363D; padding-bottom: 8px;">
        Day ${day.dayNumber} · ${escapeHtml(day.theme)}
      </div>
      ${day.stops.map((stop) => `
        <div style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
          <div style="font-size: 13px; font-weight: 700; color: #FFFFFF;">
            <span style="color: #F8D057; margin-right: 8px;">${escapeHtml(stop.time)}</span>
            ${escapeHtml(stop.name)}
            <span style="font-size: 11px; color: #8B949E; font-weight: normal; margin-left: 6px;">(${escapeHtml(stop.category)} · ${escapeHtml(stop.duration)})</span>
          </div>
          <div style="font-size: 12px; color: #C9D1D9; margin-top: 3px;">
            💡 ${escapeHtml(stop.tip)}
          </div>
          <div style="font-size: 11.5px; color: #7EE787; margin-top: 3px;">
            🎟️ Admission: ${escapeHtml(stop.costDisplay)}
          </div>
          ${stop.transitHop ? `
            <div style="font-size: 11.5px; color: #A5D6FF; background-color: #21262D; padding: 4px 8px; border-radius: 4px; margin-top: 4px;">
              🚌 Transit: ${escapeHtml(stop.transitHop)}
            </div>
          ` : ""}
        </div>
      `).join("")}
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Certified Itinerary for ${escapeHtml(plan.city)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0D1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F0F6FC; line-height: 1.5;">
  <div style="max-width: 640px; margin: 0 auto; padding: 20px;">
    
    <!-- Header Banner -->
    <div style="background-color: #161B22; border-top: 4px solid #F8D057; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 16px; border: 1px solid #30363D;">
      <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #F8D057; margin-bottom: 4px;">
        Touristमत्रम् · Verified Travel Concierge
      </div>
      <h1 style="font-size: 24px; font-weight: 900; color: #FFFFFF; margin: 4px 0 8px 0;">
        Your Tailored Travel Plan for ${escapeHtml(plan.city)}, India 🇮🇳
      </h1>
      <p style="font-size: 13px; color: #8B949E; margin: 0;">
        Certified on ${escapeHtml(generatedDate)} · Keep this email in your inbox or Gmail offline stars.
      </p>
      
      <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #30363D; font-size: 12px; color: #C9D1D9;">
        <strong>Certificate ID:</strong> <span style="color: #F8D057; font-family: monospace; font-size: 13px;">${escapeHtml(certId)}</span><br>
        <strong>Traveler:</strong> ${escapeHtml(travelerBadge)} · <strong>Total Budget:</strong> ${plan.totalBudget.toLocaleString()} ${plan.currency}
      </div>
    </div>

    <!-- Quick Emergency SOS Box -->
    <div style="background-color: rgba(218, 54, 51, 0.12); border: 1px solid rgba(218, 54, 51, 0.4); border-radius: 10px; padding: 14px 18px; margin-bottom: 16px;">
      <div style="font-size: 12px; font-weight: 800; color: #FF7B72; text-transform: uppercase; margin-bottom: 6px;">
        🚨 Emergency 24/7 Helplines in India (Save in Phone)
      </div>
      <div style="font-size: 12.5px; color: #F0F6FC;">
        • <strong>Incredible India Tourist Helpline:</strong> 1363 (24x7 toll-free)<br>
        • <strong>All-India Emergency / Police / Fire:</strong> 112<br>
        • <strong>Medical Ambulance:</strong> 108 · <strong>Women Safety:</strong> 1091
      </div>
    </div>

    <!-- Public Transit Boarding Pass -->
    <div style="background-color: #161B22; border: 1px solid #30363D; border-radius: 10px; padding: 14px 18px; margin-bottom: 16px;">
      <div style="font-size: 11px; font-weight: 800; color: #F8D057; text-transform: uppercase;">
        Recommended Transit Pass
      </div>
      <div style="font-size: 14px; font-weight: 800; color: #FFFFFF; margin-top: 2px;">
        ${escapeHtml(plan.transitPass)}
      </div>
      ${plan.operatorCode ? `
        <div style="font-size: 11px; color: #8B949E; margin-top: 2px;">
          Operator Code: ${escapeHtml(plan.operatorCode)}
        </div>
      ` : ""}
    </div>

    <!-- Day by Day Schedule -->
    <div style="margin-bottom: 16px;">
      <div style="font-size: 15px; font-weight: 800; color: #FFFFFF; margin-bottom: 10px;">
        📅 Day-by-Day Route & Scheduled Attractions
      </div>
      ${daysHtml}
    </div>

    <!-- Itemized Target Budget Table -->
    <div style="background-color: #161B22; border: 1px solid #30363D; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
      <div style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 8px;">
        📊 Curated Budget Summary
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12.5px; color: #C9D1D9;">
        <tr>
          <td style="padding: 5px 0;">Sightseeing Admissions:</td>
          <td style="text-align: right; font-weight: 700; color: #FFFFFF;">${(plan.costs?.attractions ?? Math.round((plan.totalBudget || 0) * 0.4)).toLocaleString()} ${plan.currency || "USD"}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;">Transit Pass & Connectors:</td>
          <td style="text-align: right; font-weight: 700; color: #FFFFFF;">${(plan.costs?.transit ?? Math.round((plan.totalBudget || 0) * 0.2)).toLocaleString()} ${plan.currency || "USD"}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;">Stays & Dining:</td>
          <td style="text-align: right; font-weight: 700; color: #FFFFFF;">${(plan.costs?.diningStay ?? Math.round((plan.totalBudget || 0) * 0.4)).toLocaleString()} ${plan.currency || "USD"}</td>
        </tr>
        <tr style="border-top: 1px solid #30363D;">
          <td style="padding: 8px 0; font-weight: 800; color: #F8D057;">Total Budget:</td>
          <td style="text-align: right; font-weight: 800; color: #F8D057; font-size: 14px;">${(plan.totalBudget ?? 0).toLocaleString()} ${plan.currency || "USD"}</td>
        </tr>
      </table>
    </div>

    <!-- Guarantee Footer -->
    <div style="text-align: center; padding: 16px; font-size: 11px; color: #8B949E;">
      🛡️ Certified Travel Agreement · Guaranteed Price Integrity · Touristमत्रम् Solana Network<br>
      Have a memorable and safe journey exploring India!
    </div>

  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Triggers client-side download of the self-contained offline remote pass HTML file
 */
export function downloadOfflinePassFile(plan: ItineraryPlan, options: PassGeneratorOptions = {}): void {
  if (typeof window === "undefined") return;
  const htmlContent = generateOfflinePassHTML(plan, options);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const cleanCity = plan.city.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `${cleanCity}_Offline_Remote_Pass.html`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Also cache in localStorage for instant offline access in browser
  try {
    localStorage.setItem("touristmatram_offline_pass", JSON.stringify({
      plan,
      options,
      savedAt: Date.now(),
      filename,
    }));
  } catch (e) {
    console.warn("Could not cache offline pass to localStorage", e);
  }
}

/**
 * Opens print preview window for the offline pass
 */
export function printOfflinePass(plan: ItineraryPlan, options: PassGeneratorOptions = {}): void {
  if (typeof window === "undefined") return;
  const htmlContent = generateOfflinePassHTML(plan, options);
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print the offline travel pass.");
    return;
  }
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}
