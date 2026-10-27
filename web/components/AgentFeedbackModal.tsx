"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Star,
  CheckCircle2,
  ShieldCheck,
  Bot,
  Send,
  MessageSquare,
  Sparkles,
  Award,
  ThumbsUp,
  Clock,
  MapPin,
} from "lucide-react";
import {
  AgentReview,
  getAgentReviews,
  submitAgentReview,
  normalizeAgentKey,
} from "../lib/agent-reviews";

export interface AgentFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentRating?: number; // 9.8, 9.5, 9.1, 8.9, 8.5, 7.9
  agentTrustScore?: number;
  agentRole?: string;
  itineraryTitle?: string;
  onReviewSubmitted?: (review: AgentReview) => void;
}

// Convert score to 1-5 stars count
function getStarCount(score: number): number {
  if (score <= 5) return Math.max(1, Math.min(5, Math.round(score)));
  return Math.max(1, Math.min(5, Math.round(score / 2)));
}

export function AgentFeedbackModal({
  isOpen,
  onClose,
  agentName,
  agentRating = 9.5,
  agentTrustScore = 99.2,
  agentRole = "Autonomous Travel Concierge",
  itineraryTitle = "Curated Cultural Itinerary",
  onReviewSubmitted,
}: AgentFeedbackModalProps) {
  const [activeTab, setActiveTab] = useState<"reviews" | "write">("reviews");
  const [reviewsList, setReviewsList] = useState<AgentReview[]>([]);
  const [ratingScore, setRatingScore] = useState<number>(10);
  const [authorName, setAuthorName] = useState<string>("");
  const [reviewText, setReviewText] = useState<string>("");
  const [tripContext, setTripContext] = useState<string>(itineraryTitle);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Load reviews when modal opens or agent changes
  useEffect(() => {
    if (isOpen) {
      const list = getAgentReviews(agentName);
      setReviewsList(list);
      setTripContext(itineraryTitle || "Curated Cultural Itinerary");
      setSubmitSuccess(false);
      setRatingScore(agentRating || 10);
    }
  }, [isOpen, agentName, itineraryTitle, agentRating]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const created = submitAgentReview(
        agentName,
        authorName.trim() || "Verified Traveler",
        ratingScore,
        reviewText.trim(),
        tripContext.trim()
      );

      setReviewsList((prev) => [created, ...prev]);
      setSubmitting(false);
      setSubmitSuccess(true);
      setReviewText("");
      if (onReviewSubmitted) onReviewSubmitted(created);

      // Return to reviews tab after 1.5s
      setTimeout(() => {
        setActiveTab("reviews");
        setSubmitSuccess(false);
      }, 1800);
    }, 600);
  };

  return (
    <div
      className="agent-feedback-modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(10, 25, 23, 0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "16px",
      }}
    >
      <div
        className="agent-feedback-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FAF7F2",
          color: "#1E3331",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "640px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 60px -8px rgba(0, 0, 0, 0.45), 0 0 0 1px #E2D9CC",
          border: "1.5px solid #E2D9CC",
          overflow: "hidden",
          fontFamily: "var(--font-jost), sans-serif",
          animation: "fadeUpModal 0.24s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header with Agent Info */}
        <div
          style={{
            padding: "20px 24px 16px 24px",
            borderBottom: "1px solid #E2D9CC",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(37, 99, 235, 0.1)",
                border: "1.5px solid rgba(37, 99, 235, 0.3)",
                color: "#1d4ed8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              <Bot size={24} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h3
                  style={{
                    fontSize: "1.08rem",
                    fontWeight: 700,
                    color: "#1E3331",
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {agentName}
                </h3>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#AD8958",
                    background: "rgba(173, 137, 88, 0.14)",
                    border: "1px solid rgba(173, 137, 88, 0.3)",
                    padding: "3px 8px",
                    borderRadius: 9999,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                  title="5-Star Verified Concierge"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={11}
                      fill={star <= getStarCount(agentRating) ? "#AD8958" : "none"}
                      color={star <= getStarCount(agentRating) ? "#AD8958" : "#D1D5DB"}
                    />
                  ))}
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#2D5A43",
                    background: "rgba(45, 90, 67, 0.1)",
                    border: "1px solid rgba(45, 90, 67, 0.25)",
                    padding: "2px 8px",
                    borderRadius: 9999,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <ShieldCheck size={11} />
                  ★ {agentTrustScore}% SEAL
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "#6B7280",
                  margin: "4px 0 0 0",
                  lineHeight: 1.3,
                }}
              >
                {agentRole} · Verified on Solana Devnet Agent Registry
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#6B7280",
              cursor: "pointer",
              padding: 6,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s ease",
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #E2D9CC",
            background: "#F2EDE4",
            padding: "0 24px",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            style={{
              padding: "12px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "reviews" ? "2.5px solid #652733" : "2.5px solid transparent",
              color: activeTab === "reviews" ? "#652733" : "#6B7280",
              fontWeight: activeTab === "reviews" ? 700 : 500,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s ease",
            }}
          >
            <MessageSquare size={14} />
            <span>Traveler Reviews ({reviewsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("write")}
            style={{
              padding: "12px 18px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "write" ? "2.5px solid #652733" : "2.5px solid transparent",
              color: activeTab === "write" ? "#652733" : "#6B7280",
              fontWeight: activeTab === "write" ? 700 : 500,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s ease",
            }}
          >
            <Star size={14} />
            <span>Rate &amp; Leave Feedback</span>
          </button>
        </div>

        {/* Tab Content */}
        <div
          style={{
            padding: "20px 24px",
            overflowY: "auto",
            flex: 1,
            maxHeight: "calc(90vh - 160px)",
          }}
        >
          {activeTab === "reviews" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Reviews List with Reviewer Name, Location, Verified Badge & Gold Stars */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {reviewsList.map((rev) => {
                  const stars = getStarCount(rev.rating);
                  return (
                    <div
                      key={rev.id}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E2D9CC",
                        borderRadius: "14px",
                        padding: "16px 20px",
                        boxShadow: "0 2px 8px rgba(30, 51, 49, 0.04)",
                      }}
                    >
                      {/* Reviewer Header: Name, Verified & Stars (No numbers) */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 8,
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: "rgba(101, 39, 51, 0.08)",
                              border: "1.5px solid rgba(101, 39, 51, 0.2)",
                              color: "#652733",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              fontFamily: "var(--font-mollie), Georgia, serif",
                            }}
                          >
                            {(rev.author || "T")[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "#1E3331" }}>
                                {rev.author}
                              </span>
                              {rev.verified && (
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    color: "#2D5A43",
                                    fontWeight: 600,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 2,
                                    background: "rgba(45, 90, 67, 0.08)",
                                    padding: "1px 6px",
                                    borderRadius: 9999,
                                  }}
                                >
                                  <CheckCircle2 size={10} color="#2D5A43" />
                                  Verified
                                </span>
                              )}
                            </div>
                            {rev.authorLocation && (
                              <span style={{ fontSize: "0.74rem", color: "#6B7280" }}>
                                {rev.authorLocation}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Gold Stars Display */}
                        <div
                          style={{ display: "flex", alignItems: "center", gap: 3 }}
                          aria-label={`${stars} out of 5 stars`}
                        >
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={15}
                              fill={s <= stars ? "#AD8958" : "none"}
                              color={s <= stars ? "#AD8958" : "#E2D9CC"}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Quote */}
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.88rem",
                          color: "#1E3331",
                          lineHeight: 1.6,
                          fontStyle: "italic",
                        }}
                      >
                        &ldquo;{rev.quote}&rdquo;
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Write Feedback Form */
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {submitSuccess && (
                <div
                  style={{
                    background: "rgba(45, 90, 67, 0.12)",
                    border: "1px solid rgba(45, 90, 67, 0.3)",
                    color: "#2D5A43",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Feedback recorded &amp; sealed to Solana Devnet SEAL Registry!</span>
                </div>
              )}

              {/* Rating: Interactive 5-Star Picker */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    color: "#1E3331",
                    marginBottom: 8,
                  }}
                >
                  Your Rating:
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const currentStars = getStarCount(ratingScore);
                      const isFilled = star <= currentStars;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingScore(star * 2)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "transform 0.15s ease",
                          }}
                          title={`${star} Star${star > 1 ? "s" : ""}`}
                        >
                          <Star
                            size={24}
                            fill={isFilled ? "#AD8958" : "none"}
                            color={isFilled ? "#AD8958" : "#D1D5DB"}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#652733" }}>
                    {getStarCount(ratingScore) === 5 && "5 Stars · Exceptional"}
                    {getStarCount(ratingScore) === 4 && "4 Stars · Very Good"}
                    {getStarCount(ratingScore) === 3 && "3 Stars · Good"}
                    {getStarCount(ratingScore) === 2 && "2 Stars · Fair"}
                    {getStarCount(ratingScore) === 1 && "1 Star · Needs Improvement"}
                  </span>
                </div>
              </div>

              {/* Author Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#1E3331",
                    marginBottom: 6,
                  }}
                >
                  Traveler Name / Reviewer Name:
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Sahana S. or Maya Sharma"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    background: "#FFFFFF",
                    border: "1px solid #E2D9CC",
                    borderRadius: "10px",
                    fontSize: "0.82rem",
                    color: "#1E3331",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Itinerary Context */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#1E3331",
                    marginBottom: 6,
                  }}
                >
                  Travel Itinerary Context:
                </label>
                <input
                  type="text"
                  value={tripContext}
                  onChange={(e) => setTripContext(e.target.value)}
                  placeholder="e.g. Mysuru Tailored (2D) or Hampi Ruins"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    background: "#FFFFFF",
                    border: "1px solid #E2D9CC",
                    borderRadius: "10px",
                    fontSize: "0.82rem",
                    color: "#1E3331",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Review Text */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#1E3331",
                    marginBottom: 6,
                  }}
                >
                  Traveler Feedback &amp; Review:
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="How accurate were the fair price locks? Did the agent prevent overcharges, recommend good transit, or share rich temple insights?"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#FFFFFF",
                    border: "1px solid #E2D9CC",
                    borderRadius: "10px",
                    fontSize: "0.82rem",
                    color: "#1E3331",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  style={{
                    padding: "8px 16px",
                    background: "#FFFFFF",
                    border: "1px solid #E2D9CC",
                    borderRadius: 9999,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#6B7280",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !reviewText.trim()}
                  style={{
                    padding: "8px 20px",
                    background: submitting || !reviewText.trim() ? "#A07E84" : "#652733",
                    border: "none",
                    borderRadius: 9999,
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    cursor: submitting || !reviewText.trim() ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 4px 14px rgba(101, 39, 51, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Send size={13} />
                  <span>{submitting ? "Signing On-Chain..." : "Submit Feedback"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
