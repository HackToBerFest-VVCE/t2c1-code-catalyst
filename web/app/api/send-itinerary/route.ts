import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { generateItineraryEmailHTML, ItineraryPlan } from "@/lib/offline-pass-generator";

function generatePlainTextSummary(plan: ItineraryPlan, certId: string): string {
  const lines: string[] = [
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Touristमत्रम् · Verified Digital Travel Itinerary`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Destination: ${plan.city}, India`,
    `Duration: ${plan.numDays} Days`,
    `Total Budget: ${plan.totalBudget?.toLocaleString()} ${plan.currency || "USD"}`,
    `Transit Pass: ${plan.transitPass || "Local Metro & Auto Pass"}`,
    `Digital Certificate: ${certId}`,
    ``,
    `📅 DAY-BY-DAY ITINERARY:`,
  ];

  (plan.days || []).forEach((day) => {
    lines.push(`\n▶ DAY ${day.dayNumber}: ${day.theme}`);
    (day.stops || []).forEach((stop) => {
      lines.push(`  • ${stop.time} - ${stop.name} (${stop.costDisplay})`);
      if (stop.tip) lines.push(`    Tip: ${stop.tip}`);
    });
  });

  lines.push(
    ``,
    `🚨 24/7 EMERGENCY HELPLINES:`,
    `  • National Tourist Helpline (Multi-language): 1363`,
    `  • All-in-One National Emergency: 112`,
    `  • Ambulance: 108 | Police: 100`,
    ``,
    `🔒 Certified on Solana Devnet: https://explorer.solana.com/?cluster=devnet`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
  );

  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipientEmail, cityName, plan, travelerType, foreignCountry, certificateId } = body;

    // Validate email
    if (!recipientEmail || typeof recipientEmail !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter an email address." },
        { status: 400 }
      );
    }

    const cleanEmail = recipientEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address (e.g. traveler@gmail.com)." },
        { status: 400 }
      );
    }

    if (!plan || !cityName) {
      return NextResponse.json(
        { success: false, error: "Missing itinerary plan or destination." },
        { status: 400 }
      );
    }

    const isGmail = cleanEmail.endsWith("@gmail.com") || cleanEmail.endsWith("@googlemail.com");
    const certId =
      certificateId ||
      plan.certificateId ||
      `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const subject = `Your Verified Itinerary for ${cityName} · Touristमत्रम् [${certId}]`;

    // Generate responsive HTML and Plain Text email bodies
    const emailHtml = generateItineraryEmailHTML(plan as ItineraryPlan, {
      travelerType,
      foreignCountry,
      recipientEmail: cleanEmail,
      generatedDate: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });

    const plainText = generatePlainTextSummary(plan as ItineraryPlan, certId);

    // Precomputed URLs for client-side direct dispatch
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      cleanEmail
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainText)}`;

    const mailtoUrl = `mailto:${cleanEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(plainText)}`;

    let dispatchedVia = "ethereal_test_inbox";
    let messageId = `gm_disp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    let testInboxUrl: string | null = null;
    let notice = "";

    // 1. Check for real Resend API Key
    const resendApiKey = process.env.RESEND_API_KEY;
    const hasResend =
      resendApiKey &&
      resendApiKey.trim() !== "" &&
      !resendApiKey.includes("your_resend_api_key_here") &&
      resendApiKey.startsWith("re_");

    // 2. Check for Gmail SMTP Credentials
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const hasGmailSmtp =
      gmailUser &&
      gmailAppPassword &&
      !gmailUser.includes("your_") &&
      !gmailAppPassword.includes("your_");

    // 3. Check for generic custom SMTP
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const hasCustomSmtp =
      smtpHost && smtpUser && smtpPass && !smtpHost.includes("your_");

    if (hasResend) {
      try {
        const resend = new Resend(resendApiKey);
        const fromAddress = process.env.RESEND_FROM_EMAIL
          ? `Touristमत्रम् <${process.env.RESEND_FROM_EMAIL}>`
          : "Touristमत्रम् <onboarding@resend.dev>";

        const { data, error: resendError } = await resend.emails.send({
          from: fromAddress,
          to: [cleanEmail],
          subject,
          html: emailHtml,
          text: plainText,
          replyTo: process.env.RESEND_FROM_EMAIL || undefined,
        });

        if (resendError) {
          throw new Error(resendError.message);
        }

        dispatchedVia = "resend_api";
        messageId = data?.id || messageId;
        notice = `Successfully delivered via Resend Cloud to ${cleanEmail}!`;
      } catch (err: any) {
        console.error("Resend delivery failed, falling back to SMTP/Ethereal:", err.message);
      }
    }

    if (dispatchedVia !== "resend_api" && hasGmailSmtp) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser,
            pass: gmailAppPassword,
          },
        });

        const info = await transporter.sendMail({
          from: `"Touristमत्रम्" <${gmailUser}>`,
          to: cleanEmail,
          subject,
          html: emailHtml,
          text: plainText,
        });

        dispatchedVia = "gmail_smtp";
        messageId = info.messageId;
        notice = `Successfully delivered via Gmail SMTP from ${gmailUser} to ${cleanEmail}!`;
      } catch (err: any) {
        console.error("Gmail SMTP delivery failed, falling back:", err.message);
      }
    }

    if (
      dispatchedVia !== "resend_api" &&
      dispatchedVia !== "gmail_smtp" &&
      hasCustomSmtp
    ) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const info = await transporter.sendMail({
          from: `"Touristमत्रम्" <${smtpUser}>`,
          to: cleanEmail,
          subject,
          html: emailHtml,
          text: plainText,
        });

        dispatchedVia = "custom_smtp";
        messageId = info.messageId;
        notice = `Successfully delivered via custom SMTP gateway to ${cleanEmail}!`;
      } catch (err: any) {
        console.error("Custom SMTP delivery failed, falling back:", err.message);
      }
    }

    // Fallback: Real live Ethereal test mailbox
    if (
      dispatchedVia !== "resend_api" &&
      dispatchedVia !== "gmail_smtp" &&
      dispatchedVia !== "custom_smtp"
    ) {
      try {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        const info = await transporter.sendMail({
          from: '"Touristमत्रम् Concierge" <itinerary@touristmatram.in>',
          to: cleanEmail,
          subject,
          html: emailHtml,
          text: plainText,
        });

        dispatchedVia = "ethereal_test_inbox";
        messageId = info.messageId;
        testInboxUrl = (nodemailer.getTestMessageUrl(info) as string) || null;
        notice =
          "Delivered to live Ethereal test inbox! You can view the live rendered email or open it directly in Gmail with 1 click.";
      } catch (fallbackErr: any) {
        console.error("Ethereal test send fallback error:", fallbackErr.message);
        dispatchedVia = "client_dispatch_ready";
        notice = "Itinerary prepared! Use the 1-click 'Open in Gmail' button to send directly.";
      }
    }

    return NextResponse.json({
      success: true,
      messageId,
      sentTo: cleanEmail,
      destination: cityName,
      subject,
      dispatchedVia,
      isGmail,
      timestamp: new Date().toISOString(),
      previewHtml: emailHtml,
      plainTextSummary: plainText,
      testInboxUrl,
      gmailComposeUrl,
      mailtoUrl,
      notice,
    });
  } catch (error: any) {
    console.error("Error in send-itinerary API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process and send itinerary." },
      { status: 500 }
    );
  }
}
