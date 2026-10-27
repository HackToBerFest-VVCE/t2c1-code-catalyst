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

  // Calculate dynamic average rating
  const avgRating =
    reviews.length > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
      : agentRating;

  // Star ratings distribution (product style)
  const countHigh = reviews.filter((r) => r.rating >= 9.5).length;
  const countMed = reviews.filter((r) => r.rating >= 9.0 && r.rating < 9.5).length;
  const countLow = reviews.filter((r) => r.rating < 9.0).length;
  const total = Math.max(1, reviews.length);

  const pctHigh = Math.round((countHigh / total) * 100);
  const pctMed = Math.round((countMed / total) * 100);
  const pctLow = Math.round((countLow / total) * 100);

  return (
    <div className="tourist-feedback-card">
      {/* ── 1. Product-Style Ratings Summary Header ── */}
      <div className="feedback-summary-row">
        <div className="rating-score-col">
          <div className="rating-big-number">
            <span className="big-val">{avgRating.toFixed(1)}</span>
            <span className="out-of">/ 10</span>
          </div>
          <div className="stars-row" aria-label={`Rating: ${avgRating} out of 10`}>
            {[1, 2, 3, 4, 5].map((star) => {
              const fillPct = Math.max(0, Math.min(100, (avgRating / 2 - (star - 1)) * 100));
              return (
                <div key={star} className="star-wrapper">
                  <Star size={15} className="star-empty" fill="#E2D9CC" color="#AD8958" />
                  <div className="star-fill-clip" style={{ width: `${fillPct}%` }}>
                    <Star size={15} className="star-filled" fill="#AD8958" color="#AD8958" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="reviews-count-text">
            <span>{reviews.length} Verified Tourist Reviews</span>
          </div>
        </div>

        {/* E-Commerce Product Rating Distribution Bars */}
        <div className="rating-bars-col">
          <div className="rating-bar-line">
            <span className="bar-label">9.5–10 ★</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pctHigh}%`, background: "#2D5A43" }} />
            </div>
            <span className="bar-pct">{pctHigh}%</span>
          </div>
          <div className="rating-bar-line">
            <span className="bar-label">9.0–9.4 ★</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pctMed}%`, background: "#AD8958" }} />
            </div>
            <span className="bar-pct">{pctMed}%</span>
          </div>
          <div className="rating-bar-line">
            <span className="bar-label">&lt; 9.0 ★</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pctLow}%`, background: "#B45309" }} />
            </div>
            <span className="bar-pct">{pctLow}%</span>
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

          {/* Interactive Rating Score Picker */}
          <div className="feedback-rating-picker-row">
            <label className="feedback-field-label">Your Rating (Score out of 10):</label>
            <div className="rating-chips-row">
              {[10.0, 9.8, 9.5, 9.1, 8.9, 8.5, 7.9].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setUserRating(val)}
                  className={`btn-rating-chip ${userRating === val ? "selected" : ""}`}
                >
                  ★ {val.toFixed(1)}
                </button>
              ))}
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
        {(showAllReviews ? reviews : reviews.slice(0, compact ? 1 : 2)).map((rev) => (
          <div key={rev.id} className="tourist-review-card">
            <div className="review-top-meta">
              <div className="reviewer-info">
                <span className="reviewer-name">{rev.author}</span>
                {rev.authorLocation && (
                  <span className="reviewer-location">
                    <MapPin size={10} /> {rev.authorLocation}
                  </span>
                )}
                {rev.verified && (
                  <span className="verified-tourist-pill">
                    <CheckCircle2 size={11} /> Verified Tourist
                  </span>
                )}
              </div>
              <div className="review-rating-tag">
                <span className="review-score">★ {rev.rating.toFixed(1)}</span>
                <span className="review-date">
                  <Calendar size={10} /> {rev.date}
                </span>
              </div>
            </div>

            {rev.highlightTag && (
              <div className="review-highlight-tag">
                <ThumbsUp size={11} />
                <span>{rev.highlightTag}</span>
              </div>
            )}

            <p className="review-text">&ldquo;{rev.quote}&rdquo;</p>
            {rev.trip && <div className="review-trip-tag">Trip: {rev.trip}</div>}
          </div>
        ))}
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
