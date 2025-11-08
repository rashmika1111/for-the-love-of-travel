"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Calendar, Heart, Reply } from "lucide-react";

const Comments = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      comment: "This article really opened my eyes to the future of workplace technology. The insights about remote collaboration tools are particularly relevant in today's world.",
      date: "2024-12-15",
      likes: 12,
      replies: [
        {
          id: 1,
          name: "Mike Chen",
          email: "mike.c@email.com",
          comment: "I completely agree! We've been using these tools at our company and the productivity gains have been remarkable.",
          date: "2024-12-15",
          likes: 5
        }
      ]
    },
    {
      id: 2,
      name: "Alex Rodriguez",
      email: "alex.r@email.com",
      comment: "The section about AI integration in the workplace was fascinating. It's amazing how quickly technology is evolving.",
      date: "2024-12-14",
      likes: 8,
      replies: []
    },
    {
      id: 3,
      name: "Emma Thompson",
      email: "emma.t@email.com",
      comment: "Great read! I especially enjoyed the part about sustainable technology practices. More companies should consider this approach.",
      date: "2024-12-13",
      likes: 15,
      replies: []
    }
  ]);

  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    comment: ""
  });

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.name && newComment.email && newComment.comment) {
      const comment = {
        id: Date.now(),
        name: newComment.name,
        email: newComment.email,
        comment: newComment.comment,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment({ name: "", email: "", comment: "" });
    }
  };

  const handleSubmitReply = (parentId) => {
    if (replyText.trim()) {
      const parentComment = comments.find(c => c.id === parentId);
      if (parentComment) {
        const reply = {
          id: Date.now(),
          name: "Anonymous User", // In a real app, this would be the logged-in user
          email: "user@email.com",
          comment: replyText,
          date: new Date().toISOString().split('T')[0],
          likes: 0
        };
        
        const updatedComments = comments.map(comment => 
          comment.id === parentId 
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment
        );
        setComments(updatedComments);
        setReplyText("");
        setReplyingTo(null);
      }
    }
  };

  const handleLike = (commentId, isReply = false, parentId = null) => {
    if (isReply && parentId) {
      const updatedComments = comments.map(comment => 
        comment.id === parentId 
          ? {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId 
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              )
            }
          : comment
      );
      setComments(updatedComments);
    } else {
      const updatedComments = comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      );
      setComments(updatedComments);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comments & Discussion
          </h2>
          <p className="text-gray-600 text-lg">
            Share your thoughts and join the conversation
          </p>
        </motion.div>

        {/* Add Comment Form */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Leave a Comment
            </h3>
            <form onSubmit={handleSubmitComment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newComment.name}
                    onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newComment.email}
                    onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newComment.comment}
                  onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all duration-200 resize-none"
                  placeholder="Share your thoughts..."
                />
              </div>
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  className="bg-brand-gold text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-4 h-4" />
                  Post Comment
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Comments List */}
        <div className="space-y-8">
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{comment.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
                >
                  <Heart className="w-4 h-4" />
                  <span>{comment.likes}</span>
                </button>
              </div>

              {/* Comment Content */}
              <p className="text-gray-700 leading-relaxed mb-4">
                {comment.comment}
              </p>

              {/* Comment Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-brand-gold transition-colors duration-200"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
                    />
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      className="bg-brand-gold text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200"
                    >
                      Reply
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="mt-6 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 rounded-lg p-4 ml-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium text-sm text-gray-900">{reply.name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(reply.date).toLocaleDateString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleLike(reply.id, true, comment.id)}
                          className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
                        >
                          <Heart className="w-3 h-3" />
                          <span className="text-xs">{reply.likes}</span>
                        </button>
                      </div>
                      <p className="text-sm text-gray-700">{reply.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* No Comments State */}
        {comments.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
            <p className="text-gray-500">Be the first to share your thoughts!</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Comments;
