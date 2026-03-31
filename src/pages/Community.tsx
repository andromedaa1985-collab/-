import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, Sparkles, User, Plus, ImagePlus, X, Send } from 'lucide-react';
import { useAppContext, Post } from '../store';

export default function Community() {
  const { communityPosts, setCommunityPosts, userName, userAvatar } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');

  const activePost = communityPosts.find(p => p.id === activePostId);

  const toggleLike = (id: number) => {
    setCommunityPosts(communityPosts.map(post => {
      if (post.id === id) {
        return { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 };
      }
      return post;
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!newPostContent.trim() && !newPostImage) return;

    const newPost: Post = {
      id: Date.now(),
      user: { name: userName, avatar: userAvatar },
      time: '刚刚',
      content: newPostContent.trim(),
      cardImage: newPostImage,
      likes: 0,
      comments: 0,
      isLiked: false,
      commentsList: []
    };

    setCommunityPosts([newPost, ...communityPosts]);
    setIsCreating(false);
    setNewPostContent('');
    setNewPostImage(null);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !activePostId) return;

    setCommunityPosts(communityPosts.map(post => {
      if (post.id === activePostId) {
        const newCommentObj = {
          id: Date.now(),
          user: { name: userName, avatar: userAvatar },
          content: newComment.trim(),
          time: '刚刚'
        };
        return {
          ...post,
          comments: post.comments + 1,
          commentsList: [...(post.commentsList || []), newCommentObj]
        };
      }
      return post;
    }));
    setNewComment('');
  };

  return (
    <div className="min-h-full w-full px-4 pt-12 pb-32 relative">
      <div className="flex items-center justify-between mb-6 px-2">
        <h1 className="font-serif text-3xl font-bold tracking-widest text-[#007AFF]">星轨社区</h1>
        <button className="p-2 rounded-full glass-panel hover:bg-black/5 transition-colors border-black/5 text-[#007AFF]">
          <Sparkles size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {communityPosts.map((post, index) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel rounded-3xl p-5 border-black/5 shadow-sm"
          >
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#007AFF]/20 to-[#0056b3]/20 p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {post.user.avatar ? (
                    <img src={post.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-[#007AFF]/60" />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-[#1D1D1F]">{post.user.name}</span>
                <span className="text-[10px] text-[#8E8E93] font-mono">{post.time}</span>
              </div>
            </div>

            {/* Content */}
            {post.content && (
              <p className="text-sm text-[#1D1D1F] leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
              </p>
            )}

            {/* Optional Image */}
            {post.cardImage && (
              <div className="w-full aspect-[2/3] max-w-[200px] rounded-2xl overflow-hidden mb-4 border border-black/5 shadow-sm">
                <img src={post.cardImage} alt="Shared Card" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 pt-3 border-t border-black/5">
              <button 
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${post.isLiked ? 'text-[#FF3B30]' : 'text-[#8E8E93] hover:text-[#1D1D1F]'}`}
              >
                <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
                <span className="text-xs font-mono">{post.likes}</span>
              </button>
              <button 
                onClick={() => setActivePostId(post.id)}
                className="flex items-center gap-1.5 text-[#8E8E93] hover:text-[#1D1D1F] transition-colors"
              >
                <MessageCircle size={18} />
                <span className="text-xs font-mono">{post.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 text-[#8E8E93] hover:text-[#1D1D1F] transition-colors ml-auto">
                <Share2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCreating(true)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-tr from-[#007AFF] to-[#0056b3] text-white rounded-full shadow-lg shadow-[#007AFF]/30 flex items-center justify-center z-40"
      >
        <Plus size={24} />
      </motion.button>

      {/* Create Post Modal */}
      {createPortal(
        <AnimatePresence>
          {isCreating && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsCreating(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: '100%' }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif font-bold text-lg text-[#1D1D1F]">发布新动态</h3>
                <button onClick={() => setIsCreating(false)} className="p-2 rounded-full hover:bg-black/5 text-black/40 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="分享你的占卜感悟、抽到的塔罗牌，或是此刻的心情..."
                  className="w-full h-32 bg-transparent resize-none text-sm text-[#1D1D1F] placeholder:text-[#8E8E93] focus:outline-none mb-4"
                />

                {newPostImage && (
                  <div className="relative w-32 aspect-[2/3] rounded-2xl overflow-hidden mb-4 border border-black/5 shadow-sm group">
                    <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setNewPostImage(null)}
                      className="absolute top-2 right-2 p-1 bg-black/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full text-[#007AFF] hover:bg-[#007AFF]/10 transition-colors"
                >
                  <ImagePlus size={24} />
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
                
                <button 
                  onClick={handleSubmit}
                  disabled={!newPostContent.trim() && !newPostImage}
                  className="px-6 py-2.5 bg-[#007AFF] text-white rounded-full font-medium shadow-md shadow-[#007AFF]/20 flex items-center gap-2 hover:bg-[#0056b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                  发布
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* Comments Modal */}
      {createPortal(
        <AnimatePresence>
          {activePostId && activePost && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:px-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setActivePostId(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-[#F2F2F7] rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 flex flex-col h-[80vh] sm:h-[600px]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 bg-white rounded-t-3xl sm:rounded-t-3xl border-b border-black/5 shrink-0">
                <h3 className="font-serif font-bold text-lg text-[#1D1D1F]">评论 ({activePost.comments})</h3>
                <button onClick={() => setActivePostId(null)} className="p-2 rounded-full hover:bg-black/5 text-black/40 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {(!activePost.commentsList || activePost.commentsList.length === 0) ? (
                  <div className="flex flex-col items-center justify-center h-full text-[#8E8E93]">
                    <MessageCircle size={48} className="mb-4 opacity-20" />
                    <p className="text-sm">还没有评论，快来抢沙发吧！</p>
                  </div>
                ) : (
                  activePost.commentsList.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#007AFF]/20 to-[#0056b3]/20 p-0.5 shrink-0">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                          {comment.user.avatar ? (
                            <img src={comment.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User size={16} className="text-[#007AFF]/60" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-black/5">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="font-medium text-xs text-[#1D1D1F]">{comment.user.name}</span>
                          <span className="text-[10px] text-[#8E8E93] font-mono">{comment.time}</span>
                        </div>
                        <p className="text-sm text-[#1D1D1F]">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-black/5 shrink-0 pb-safe">
                <div className="flex items-center gap-2 bg-[#F2F2F7] rounded-full px-4 py-2 border border-black/5">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="说点什么..."
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="p-1.5 bg-[#007AFF] text-white rounded-full disabled:opacity-50 disabled:bg-[#8E8E93] transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </div>
  );
}
