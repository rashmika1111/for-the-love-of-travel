"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, User, Calendar, Heart, Reply, Loader2, ThumbsDown, Flag } from "lucide-react";
import { useParams } from "next/navigation";
import ReportCommentModal from "./ReportCommentModal";

const Comments = () => {
  const params = useParams();
  const postSlug = params?.slug;
  
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    website: "",
    comment: ""
  });

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyForm, setReplyForm] = useState({
    name: "",
    email: "",
    website: ""
  });
  const [rateLimitedUntil, setRateLimitedUntil] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [reportModal, setReportModal] = useState({ isOpen: false, commentId: null, commentAuthor: "" });

  // Check if rate limit has expired
  useEffect(() => {
    if (rateLimitedUntil && new Date() > rateLimitedUntil) {
      setRateLimitedUntil(null);
    }
  }, [rateLimitedUntil]);

  // Fetch comments from API
  const fetchComments = async () => {
    if (!postSlug) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/interactions/posts/${postSlug}/comments?includeReplies=true`);
      const data = await response.json();
      
      if (data.success) {
        // Transform flat comments into nested structure
        const commentsData = data.data || [];
        const commentsMap = new Map();
        const rootComments = [];
        
        // First pass: create map of all comments
        commentsData.forEach(comment => {
          commentsMap.set(comment._id, { ...comment, replies: [] });
        });
        
        // Second pass: build nested structure
        commentsData.forEach(comment => {
          if (comment.parentId) {
            // This is a reply
            const parent = commentsMap.get(comment.parentId);
            if (parent) {
              parent.replies.push(comment);
            }
          } else {
            // This is a root comment
            rootComments.push(commentsMap.get(comment._id));
          }
        });
        
        console.log('Comments loaded:', rootComments);
        console.log('Comments with replies:', rootComments.filter(c => c.replies && c.replies.length > 0));
        console.log('Raw comments data:', commentsData);
        console.log('First comment structure:', JSON.stringify(rootComments[0], null, 2));
        console.log('All comments structure:', JSON.stringify(commentsData, null, 2));
        
        setComments(rootComments);
      } else {
        setError(data.message || 'Failed to load comments');
      }
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load comments on component mount
  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.name || !newComment.email || !newComment.comment) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch(`/api/interactions/posts/${postSlug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: {
            name: newComment.name,
            email: newComment.email,
            website: newComment.website
          },
          content: newComment.comment
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage(data.data.status === 'approved' 
          ? 'Comment posted successfully!' 
          : 'Comment submitted for moderation. Thank you!');
        setNewComment({ name: "", email: "", website: "", comment: "" });
        // Refresh comments to show the new one if approved
        if (data.data.status === 'approved') {
          fetchComments();
        }
      } else {
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err => `${err.field}: ${err.message}`).join(', ');
          setError(errorMessages);
        } else {
          setError(data.message || 'Failed to submit comment');
        }
      }
    } catch (err) {
      setError('Failed to submit comment. Please try again.');
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyText.trim()) {
      setError('Please enter a reply');
      return;
    }
    
    if (!replyForm.name.trim() || !replyForm.email.trim()) {
      setError('Please fill in your name and email to reply');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // Find the parent comment to get author info
      const parentComment = comments.find(c => c._id === parentId);
      
      const replyData = {
        author: {
          name: replyForm.name.trim(),
          email: replyForm.email.trim(),
          website: replyForm.website?.trim() || ""
        },
        content: replyText.trim(),
        parentId: parentId
      };
      
      // Validate the data before sending (matching backend validation)
      if (!replyData.author.name || !replyData.author.email || !replyData.content) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }
      
      // Name validation (2-100 characters)
      if (replyData.author.name.length < 2 || replyData.author.name.length > 100) {
        setError('Name must be between 2 and 100 characters');
        setSubmitting(false);
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(replyData.author.email)) {
        setError('Please enter a valid email address');
        setSubmitting(false);
        return;
      }
      
      if (replyData.author.email.length > 255) {
        setError('Email address is too long');
        setSubmitting(false);
        return;
      }
      
      // Comment content validation (10-2000 characters)
      if (replyData.content.length < 10 || replyData.content.length > 2000) {
        setError('Reply must be between 10 and 2000 characters');
        setSubmitting(false);
        return;
      }
      
      // Website validation (optional, but if provided, should be reasonable)
      if (replyData.author.website && replyData.author.website.length > 255) {
        setError('Website URL is too long');
        setSubmitting(false);
        return;
      }
      
      console.log('Submitting reply with data:', replyData);
      console.log('Parent comment found:', parentComment);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Request timeout - aborting after 30 seconds');
        controller.abort();
      }, 30000); // 30 second timeout
      
      console.log('Making request to:', `/api/interactions/posts/${postSlug}/comments`);
      console.log('Request body:', JSON.stringify(replyData, null, 2));
      
      const response = await fetch(`/api/interactions/posts/${postSlug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Response received:', response.status, response.statusText);

      if (!response.ok) {
        // Try to get the error message from the response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('API Error Response:', errorData);
        } catch (e) {
          console.error('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage(data.data.status === 'approved' 
          ? 'Reply posted successfully!' 
          : 'Reply submitted for moderation. Thank you!');
        setReplyText("");
        setReplyingTo(null);
        // Clear the reply form fields
        setReplyForm({ name: "", email: "", website: "" });
        
        // Optimistically add the reply to the UI immediately
        const newReply = {
          _id: `temp-${Date.now()}`,
          author: replyData.author,
          content: replyData.content,
          createdAt: new Date().toISOString(),
          likes: 0,
          dislikes: 0,
          parentId: parentId
        };
        
        // Add the reply to the parent comment immediately
        setComments(prevComments => 
          prevComments.map(comment => 
            comment._id === parentId 
              ? { ...comment, replies: [...(comment.replies || []), newReply] }
              : comment
          )
        );
        
        // Refresh comments in the background to get the real data
        setTimeout(() => {
          fetchComments();
        }, 1000);
      } else {
        setError(data.message || 'Failed to submit reply');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Reply submission timed out. The server may be experiencing issues. Please try again in a few moments.');
      } else if (err.message.includes('Too many comments')) {
        const rateLimitMessage = 'You\'ve submitted too many comments recently. Please wait an hour before submitting another reply.';
        setError(rateLimitMessage);
        // Set rate limit until 1 hour from now
        setRateLimitedUntil(new Date(Date.now() + 60 * 60 * 1000));
      } else if (err.message.includes('rate limit')) {
        setError('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (err.message.includes('Invalid parent comment')) {
        setError('There was an issue with the comment you\'re replying to. Please refresh the page and try again.');
      } else {
        setError(err.message || 'Failed to submit reply. Please try again.');
      }
      console.error('Error submitting reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId, isReply = false, parentId = null) => {
    try {
      const response = await fetch(`/api/interactions/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the comment in the state
        if (isReply && parentId) {
          const updatedComments = comments.map(comment => 
            comment._id === parentId 
              ? {
                  ...comment,
                  replies: comment.replies.map(reply => 
                    reply._id === commentId 
                      ? { ...reply, likes: data.data.likes }
                      : reply
                  )
                }
              : comment
          );
          setComments(updatedComments);
        } else {
          const updatedComments = comments.map(comment => 
            comment._id === commentId 
              ? { ...comment, likes: data.data.likes }
              : comment
          );
          setComments(updatedComments);
        }
      }
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const handleDislike = async (commentId, isReply = false, parentId = null) => {
    try {
      const response = await fetch(`/api/interactions/comments/${commentId}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the comment in the state
        if (isReply && parentId) {
          const updatedComments = comments.map(comment => 
            comment._id === parentId 
              ? {
                  ...comment,
                  replies: comment.replies.map(reply => 
                    reply._id === commentId 
                      ? { ...reply, dislikes: data.data.dislikes }
                      : reply
                  )
                }
              : comment
          );
          setComments(updatedComments);
        } else {
          const updatedComments = comments.map(comment => 
            comment._id === commentId 
              ? { ...comment, dislikes: data.data.dislikes }
              : comment
          );
          setComments(updatedComments);
        }
      }
    } catch (err) {
      console.error('Error disliking comment:', err);
    }
  };

  const handleReport = (commentId, commentAuthor) => {
    setReportModal({
      isOpen: true,
      commentId,
      commentAuthor
    });
  };

  const closeReportModal = () => {
    setReportModal({
      isOpen: false,
      commentId: null,
      commentAuthor: ""
    });
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header - UPSCALED */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Comments & Discussion
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl lg:text-2xl">
            Share your thoughts and join the conversation
          </p>
        </motion.div>

        {/* Add Comment Form - UPSCALED */}
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8">
              Leave a Comment
            </h3>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{successMessage}</p>
              </div>
            )}
            <form onSubmit={handleSubmitComment} className="space-y-6 sm:space-y-8 w-full min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newComment.name}
                    onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all duration-200 min-w-0"
                    placeholder="Your name"
                    style={{ maxWidth: '100%' }}
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newComment.email}
                    onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all duration-200 min-w-0"
                    placeholder="your.email@example.com"
                    style={{ maxWidth: '100%' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                  Website (optional)
                </label>
                <input
                  type="text"
                  value={newComment.website}
                  onChange={(e) => setNewComment({ ...newComment, website: e.target.value })}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all duration-200 min-w-0"
                  placeholder="https://yourwebsite.com"
                  style={{ maxWidth: '100%' }}
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                  Comment *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newComment.comment}
                  onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all duration-200 resize-none min-w-0"
                  placeholder="Share your thoughts..."
                  style={{ maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}
                />
              </div>
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-gold text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 flex items-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                  {submitting ? 'Posting...' : 'Post Comment'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Comments List - UPSCALED */}
        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
              <span className="ml-3 text-gray-600">Loading comments...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchComments}
                className="bg-brand-gold text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment, index) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-200 relative"
            >
              {/* Comment Header - Enhanced with reply indicator */}
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-brand-gold rounded-full flex items-center justify-center relative">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                    {/* Reply indicator badge */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {comment.replies.length}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900">{comment.author.name}</h4>
                      {comment.replies && comment.replies.length > 0 && (
                        <span className="text-xs sm:text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                          {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-500">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment Content - UPSCALED */}
              <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
                {comment.content}
              </p>

              {/* Comment Actions - UPSCALED */}
              <div className="flex items-center gap-4 sm:gap-6">
                <button
                  onClick={() => handleLike(comment._id)}
                  className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base md:text-lg">{comment.likes || 0}</span>
                </button>
                <button
                  onClick={() => handleDislike(comment._id)}
                  className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                >
                  <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base md:text-lg">{comment.dislikes || 0}</span>
                </button>
                <button
                  onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-brand-gold transition-colors duration-200"
                >
                  <Reply className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base md:text-lg">Reply</span>
                </button>
                <button
                  onClick={() => handleReport(comment._id, comment.author.name)}
                  className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
                >
                  <Flag className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base md:text-lg">Report</span>
                </button>
              </div>

              {/* Reply Form - UPSCALED */}
              {replyingTo === comment._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100"
                >
                  {/* Rate Limit Warning */}
                  {rateLimitedUntil && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-800">
                            You've reached the comment rate limit. Please wait before submitting another reply.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <input
                        type="text"
                        value={replyForm.name}
                        onChange={(e) => setReplyForm({ ...replyForm, name: e.target.value })}
                        placeholder="Your name *"
                        className="px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
                      />
                      <input
                        type="email"
                        value={replyForm.email}
                        onChange={(e) => setReplyForm({ ...replyForm, email: e.target.value })}
                        placeholder="Your email *"
                        className="px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      value={replyForm.website}
                      onChange={(e) => setReplyForm({ ...replyForm, website: e.target.value })}
                      placeholder="Website (optional)"
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
                    />
                    <div className="space-y-3 sm:space-y-4">
                      <div className="relative">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply... (minimum 10 characters)"
                          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none resize-none min-w-0 max-w-full"
                          rows={3}
                          disabled={submitting}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                          {replyText.length}/2000
                          {replyText.length < 10 && replyText.length > 0 && (
                            <span className="text-red-500 ml-1">(min 10)</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSubmitReply(comment._id)}
                        disabled={submitting || replyText.length < 10 || rateLimitedUntil}
                        className="bg-brand-gold text-white px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Submitting...' : 
                         rateLimitedUntil ? 'Rate Limited' : 
                         'Reply'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Replies - Enhanced with better visual hierarchy */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  {/* Reply section header */}
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <div className="w-6 h-px bg-gray-300"></div>
                    <span className="text-sm sm:text-base font-medium text-gray-600">
                      {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}
                    </span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {comment.replies.map((reply, replyIndex) => (
                      <motion.div 
                        key={reply._id} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: replyIndex * 0.1 }}
                        className="relative"
                      >
                        {/* Visual connection line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-gray-300 via-gray-200 to-transparent"></div>
                        
                        <div className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-brand-gold/30 rounded-lg p-4 sm:p-6 ml-6 sm:ml-8 md:ml-10 shadow-sm hover:shadow-md transition-all duration-200">
                          {/* Reply header with better visual hierarchy */}
                          <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-brand-gold/20 to-brand-gold/40 rounded-full flex items-center justify-center border-2 border-brand-gold/30">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm sm:text-base text-gray-900">{reply.author.name}</span>
                                  <span className="text-xs sm:text-sm text-brand-gold font-medium">replied</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Reply content */}
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6 pl-2 border-l-2 border-gray-200">
                            {reply.content}
                          </p>

                          {/* Reply actions */}
                          <div className="flex items-center gap-3 sm:gap-4 pl-2">
                            <button
                              onClick={() => handleLike(reply._id, true, comment._id)}
                              className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
                            >
                              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="text-xs sm:text-sm font-medium">{reply.likes || 0}</span>
                            </button>
                            <button
                              onClick={() => handleDislike(reply._id, true, comment._id)}
                              className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                            >
                              <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="text-xs sm:text-sm font-medium">{reply.dislikes || 0}</span>
                            </button>
                            <button
                              onClick={() => handleReport(reply._id, reply.author.name)}
                              className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors duration-200"
                            >
                              <Flag className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="text-xs sm:text-sm">Report</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))
          )}
        </div>

      </div>

      {/* Report Comment Modal */}
      <ReportCommentModal
        isOpen={reportModal.isOpen}
        onClose={closeReportModal}
        commentId={reportModal.commentId}
        commentAuthor={reportModal.commentAuthor}
      />
    </section>
  );
};

export default Comments;
