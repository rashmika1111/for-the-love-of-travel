"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Send, Loader2 } from "lucide-react";

const ReportCommentModal = ({ isOpen, onClose, commentId, commentAuthor }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const reportReasons = [
    { value: "spam", label: "Spam or promotional content" },
    { value: "inappropriate", label: "Inappropriate or offensive language" },
    { value: "harassment", label: "Harassment or bullying" },
    { value: "misinformation", label: "False or misleading information" },
    { value: "off-topic", label: "Off-topic or irrelevant content" },
    { value: "other", label: "Other (please specify)" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReason) {
      setError("Please select a reason for reporting this comment");
      return;
    }

    if (selectedReason === "other" && !description.trim()) {
      setError("Please provide a description when selecting 'Other'");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(`/api/interactions/comments/${commentId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: selectedReason,
          description: description.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setSelectedReason("");
          setDescription("");
        }, 2000);
      } else {
        setError(data.message || 'Failed to report comment');
      }
    } catch (err) {
      setError('Failed to report comment. Please try again.');
      console.error('Error reporting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
      setSelectedReason("");
      setDescription("");
      setError("");
      setSuccess(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        style={{ paddingTop: '4rem', paddingBottom: '2rem' }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white max-w-md w-full max-h-[85vh] shadow-2xl"
          style={{ 
            borderRadius: '0.75rem',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Report Comment</h3>
                <p className="text-sm text-gray-500">Help us maintain a respectful community</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={submitting}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Report Submitted</h4>
                <p className="text-gray-600">Thank you for helping us maintain a respectful community. We'll review this comment.</p>
              </motion.div>
            ) : (
              <>
                {/* Comment Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Reporting comment by:</p>
                  <p className="font-medium text-gray-900">{commentAuthor}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Reason Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Why are you reporting this comment? *
                    </label>
                    <div className="space-y-2">
                      {reportReasons.map((reason) => (
                        <label key={reason.value} className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="reason"
                            value={reason.value}
                            checked={selectedReason === reason.value}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="mt-1 w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">{reason.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional details (optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                      placeholder="Please provide any additional context that might help us understand the issue..."
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={submitting}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !selectedReason}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {submitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReportCommentModal;
