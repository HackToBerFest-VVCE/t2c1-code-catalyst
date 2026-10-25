import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateItineraryEmailHTML, ItineraryPlan } from "@/lib/offline-pass-generator";

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

    // Generate responsive HTML email body
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

    const messageId = `gm_disp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email service is not configured. Please add RESEND_API_KEY to your environment and restart the server.",
        },
        { status: 503 }
      );
    }

    // Real dispatch via Resend
    const resend = new Resend(apiKey);

    // On free tier without verified domain, Resend only allows onboarding@resend.dev as sender
    // Use a verified sender domain if configured, otherwise fall back to onboarding@resend.dev
    const fromAddress = process.env.RESEND_FROM_EMAIL
      ? `Touristमत्रम् <${process.env.RESEND_FROM_EMAIL}>`
      : "Touristमत्रम् <onboarding@resend.dev>";

    const { data, error: resendError } = await resend.emails.send({
      from: fromAddress,
      to: [cleanEmail],
      subject,
      html: emailHtml,
      replyTo: process.env.RESEND_FROM_EMAIL || undefined,
    });

    if (resendError) {
      console.error("Resend API error:", resendError);
      return NextResponse.json(
        {
          success: false,
          error: `Email delivery failed: ${resendError.message || "Unknown error from Resend"}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id || messageId,
      sentTo: cleanEmail,
      destination: cityName,
      subject,
      dispatchedVia: "resend_api",
      isGmail,
      timestamp: new Date().toISOString(),
      previewHtml: emailHtml,
      notice: isGmail
        ? "Successfully delivered to your Gmail inbox! If you don't see it immediately, please check your Updates or Promotions tab."
        : `Successfully delivered to ${cleanEmail}!`,
    });
  } catch (error: any) {
    console.error("Error in send-itinerary API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process and send itinerary." },
      { status: 500 }
    );
  }
}
