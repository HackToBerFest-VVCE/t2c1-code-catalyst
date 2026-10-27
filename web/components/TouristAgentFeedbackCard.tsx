"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  Bot,
  Send,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  AgentReview,
  getAgentReviews,
  getTopAgentReview,
  submitAgentReview,
  normalizeAgentKey,
} from "../lib/agent-reviews";

interface TouristAgentFeedbackCardProps {
  agentName: string;
  agentDisplayName?: string;
  agentRole?: string;
  agentRating?: number;
  agentTrustScore?: number;
  agentPda?: string;
  tripContext?: string;
  compact?: boolean;
  onRatingChanged?: (newRating: number) => void;
}

export function TouristAgentFeedbackCard({
  agentName,
  agentDisplayName,
  agentRole = "Autonomous Travel Concierge",
  agentRating = 9.8,
  agentTrustScore = 99.8,
  agentPda,
  tripContext = "Verified Cultural Itinerary",
  compact = false,
  onRatingChanged,
}: TouristAgentFeedbackCardProps) {
  const [reviews, setReviews] = useState<AgentReview[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);

  // Form State
  const [authorName, setAuthorName] = useState("");
  const [authorLocation, setAuthorLocation] = useState("");
  const [userRating, setUserRating] = useState<number>(agentRating || 9.5);
  const [reviewQuote, setReviewQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Load reviews whenever agentName changes
  useEffect(() => {
    const list = getAgentReviews(agentDisplayName || agentName);
    setReviews(list);
    setUserRating(agentRating || 9.5);
    setSuccessNotice(null);
  }, [agentName, agentDisplayName, agentRating]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewQuote.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const created = submitAgentReview(
        agentDisplayName || agentName,
        authorName.trim() || "Verified Tourist",
        userRating,
        reviewQuote.trim(),
        tripContext
      );

      setReviews((prev) => [created, ...prev]);
      setSubmitting(false);
      setReviewQuote("");
      setAuthorName("");
      setAuthorLocation("");
      setSuccessNotice("✓ Your tourist review was verified on-chain and added!");
      setShowWriteReview(false);
      if (onRatingChanged) onRatingChanged(userRating);

      setTimeout(() => setSuccessNotice(null), 4000);
    }, 450);
  };

  const displayName = agentDisplayName || agentName;
  const topReview = reviews[0] || getTopAgentReview(displayName);

  // Helper to convert score to 1-5 stars
  const getStarCount = (score: number): number => {
    if (score <= 5) return Math.max(1, Math.min(5, Math.round(score)));
    return Math.max(1, Math.min(5, Math.round(score / 2)));
  };

  // Calculate dynamic average rating
  const avgRating =
    reviews.length > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
      : agentRating;

  // Star ratings distribution (5-star, 4-star, 3-star)
  const count5 = reviews.filter((r) => getStarCount(r.rating) === 5).length;
  const count4 = reviews.filter((r) => getStarCount(r.rating) === 4).length;
  const count3 = reviews.filter((r) => getStarCount(r.rating) <= 3).length;
  const total = Math.max(1, reviews.length);

  const pct5 = Math.round((count5 / total) * 100);
  const pct4 = Math.round((count4 / total) * 100);
  const pct3 = Math.round((count3 / total) * 100);

  return (
    <div className="tourist-feedback-card">
      {/* ── 1. Product-Style Ratings Summary Header ── */}
      <div className="feedback-summary-row">
        <div className="rating-score-col">
          <div className="stars-row" aria-label="5 Star Rating" style={{ display: "flex", gap: 3, alignItems: "center", marginBottom: 3 }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const stars = getStarCount(avgRating);
              return (
                <Star
                  key={star}
                  size={18}
                  fill={star <= stars ? "#AD8958" : "none"}
                  color={star <= stars ? "#AD8958" : "#E2D9CC"}
                />
              );
            })}
          </div>
          <div className="reviews-count-text">
            <span>{reviews.length} Verified Tourist Reviews</span>
          </div>
        </div>

        {/* E-Commerce Product Rating Distribution Bars (5 Star, 4 Star, 3 Star) */}
        <div className="rating-bars-col">
          <div className="rating-bar-line">
            <span className="bar-label">5 ★</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pct5}%`, background: "#2D5A43" }} />
            </div>
            <span className="bar-pct">{pct5}%</span>
          </div>
          <div className="rating-bar-line">
            <span className="bar-label">4 ★</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pct4}%`, background: "#AD8958" }} />
            </div>
            <span className="bar-pct">{pct4}%</span>
          </div>
          <div className="rating-bar-line">
            <span className="bar-label">3 ★</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pct3}%`, background: "#B45309" }} />
            </div>
            <span className="bar-pct">{pct3}%</span>
          </div>
        </div>

        {/* Trust Badges & Action Button */}
        <div className="feedback-actions-col">
          <div className="feedback-badge-pill">
            <ShieldCheck size={13} color="#2D5A43" />
            <span>{agentTrustScore}% SEAL Trust</span>
          </div>
          <button
            type="button"
            onClick={() => setShowWriteReview((prev) => !prev)}
            className="btn-write-feedback"
            title="Write a verified review for this AI Concierge"
          >
            <MessageSquare size={13} />
            <span>{showWriteReview ? "Cancel" : "Write a Review"}</span>
          </button>
        </div>
      </div>

      {/* ── Success Toast ── */}
      {successNotice && (
        <div className="feedback-success-banner" role="status">
          <CheckCircle2 size={14} color="#10B981" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* ── 2. Interactive "Write Tourist Review" Form (Product Style) ── */}
      {showWriteReview && (
        <form onSubmit={handleReviewSubmit} className="feedback-form-box">
          <div className="feedback-form-title">
            <Sparkles size={14} color="var(--color-ottone, #AD8958)" />
            <span>Leave Tourist Feedback for {displayName}</span>
          </div>

          <div className="feedback-form-row">
            <div className="form-field-item">
              <label className="feedback-field-label">Your Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Rahul & Sunita M."
                className="feedback-field-input"
              />
            </div>
            <div className="form-field-item">
              <label className="feedback-field-label">Home City / Country</label>
              <input
                type="text"
                value={authorLocation}
                onChange={(e) => setAuthorLocation(e.target.value)}
                placeholder="e.g. London, UK or Bengaluru"
                className="feedback-field-input"
              />
            </div>
          </div>

          {/* Interactive 5-Star Rating Picker */}
          <div className="feedback-rating-picker-row">
            <label className="feedback-field-label">Your Rating:</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const currentStars = getStarCount(userRating);
                  const isFilled = star <= currentStars;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star * 2)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "3px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title={`${star} Star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        size={22}
                        fill={isFilled ? "#AD8958" : "none"}
                        color={isFilled ? "#AD8958" : "#D1D5DB"}
                      />
                    </button>
                  );
                })}
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#652733" }}>
                {getStarCount(userRating) === 5 && "5 Stars · Exceptional"}
                {getStarCount(userRating) === 4 && "4 Stars · Very Good"}
                {getStarCount(userRating) === 3 && "3 Stars · Good"}
                {getStarCount(userRating) === 2 && "2 Stars · Fair"}
                {getStarCount(userRating) === 1 && "1 Star · Needs Improvement"}
              </span>
            </div>
          </div>

          <div className="form-field-item" style={{ marginTop: 10 }}>
            <label className="feedback-field-label">Your Experience &amp; Feedback</label>
            <textarea
              rows={2}
              value={reviewQuote}
              onChange={(e) => setReviewQuote(e.target.value)}
              placeholder="How was the fare pricing, temple timing guidance, or safety suggestions?"
              className="feedback-field-textarea"
              required
            />
          </div>

          <div className="feedback-submit-row">
            <span className="submit-hint">
              🛡 Reviews are cryptographically tagged to the Solana AI Concierge Registry.
            </span>
            <button
              type="submit"
              disabled={submitting || !reviewQuote.trim()}
              className="btn-submit-review"
            >
              <Send size={13} />
              <span>{submitting ? "Submitting..." : "Submit Review"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ── 3. Product-Style Verified Tourist Reviews Stream ── */}
      <div className="feedback-reviews-list">
        {(showAllReviews ? reviews : reviews.slice(0, compact ? 1 : 2)).map((rev) => {
          const stars = getStarCount(rev.rating);
          return (
            <div key={rev.id} className="tourist-review-card">
              {/* Reviewer Header: Name + Location + 5 Stars */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1E3331" }}>
                    {rev.author}
                  </span>
                  {rev.authorLocation && (
                    <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                      · {rev.authorLocation}
                    </span>
                  )}
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
                        padding: "1px 5px",
                        borderRadius: 9999,
                      }}
                    >
                      <CheckCircle2 size={10} color="#2D5A43" />
                      Verified
                    </span>
                  )}
                </div>

                {/* 5 Stars Only (No Numbers) */}
                <div style={{ display: "flex", alignItems: "center", gap: 2 }} aria-label={`${stars} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      fill={s <= stars ? "#AD8958" : "none"}
                      color={s <= stars ? "#AD8958" : "#E2D9CC"}
                    />
                  ))}
                </div>
              </div>

              <p className="review-text" style={{ margin: 0, fontStyle: "italic", fontSize: "0.86rem", color: "#1E3331", lineHeight: 1.55 }}>
                &ldquo;{rev.quote}&rdquo;
              </p>
            </div>
          );
        })}
      </div>

      {/* ── 4. Toggle Show All / Less Reviews ── */}
      {reviews.length > (compact ? 1 : 2) && (
        <button
          type="button"
          onClick={() => setShowAllReviews((prev) => !prev)}
          className="btn-toggle-all-reviews"
        >
          <span>
            {showAllReviews
              ? "Show Less Reviews"
              : `View All ${reviews.length} Verified Tourist Reviews`}
          </span>
          {showAllReviews ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      )}
    </div>
  );
}
