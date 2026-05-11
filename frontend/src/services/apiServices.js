import api from './api';
import { EP } from '../constants/api';

export const authService = {
  signup:  (d) => api.post(EP.SIGNUP, d),
  signin:  (d) => api.post(EP.SIGNIN, d),
  signout: ()  => api.post(EP.SIGNOUT),
};

export const userService = {
  getMe:         ()    => api.get(EP.ME),
  getProfile:    (id)  => api.get(EP.USER(id)),
  updateProfile: (d)   => api.put(EP.UPDATE_PROFILE, d),
  searchUsers:   (q)   => api.get(EP.SEARCH_USERS, { params: { q } }),
};

export const postService = {
  create:       (d)              => api.post(EP.POSTS, d),
  getOne:       (id)             => api.get(EP.POST(id)),
  getFeed:      (page=0,size=10) => api.get(EP.FEED, { params: { page, size } }),
  getUserPosts: (id, page=0)     => api.get(EP.USER_POSTS(id), { params: { page, size: 12 } }),
  delete:       (id)             => api.delete(EP.POST(id)),
};

export const likeService = {
  togglePost:    (id) => api.post(EP.LIKE_POST(id)),
  toggleComment: (id) => api.post(EP.LIKE_COMMENT(id)),
  toggleMessage: (id) => api.post(EP.LIKE_MESSAGE(id)),
  toggleStory:   (id) => api.post(EP.LIKE_STORY(id)),
};

export const commentService = {
  add:    (postId, d) => api.post(EP.COMMENTS(postId), d),
  getAll: (postId)    => api.get(EP.COMMENTS(postId)),
  delete: (id)        => api.delete(EP.DELETE_COMMENT(id)),
};

export const followService = {
  toggle:      (id) => api.post(EP.FOLLOW(id)),
  getFollowers:(id) => api.get(EP.FOLLOWERS(id)),
  getFollowing:(id) => api.get(EP.FOLLOWING(id)),
};

export const storyService = {
  create:   (mediaUrl, recipientId, sharedPostId) =>
    api.post(EP.STORIES, null, { params: { mediaUrl, ...(recipientId && {recipientId}), ...(sharedPostId && {sharedPostId}) } }),
  getFeed:  ()   => api.get(EP.STORY_FEED),
  getUser:  (id) => api.get(EP.USER_STORIES(id)),
  view:     (id) => api.post(EP.VIEW_STORY(id)),
};

export const messageService = {
  send:         (rid, d) => api.post(EP.SEND_MSG(rid), d),
  conversation: (uid)    => api.get(EP.CONVERSATION(uid)),
  markRead:     (id)     => api.patch(EP.MARK_READ(id)),
};

export const notifService = {
  getAll:       () => api.get(EP.NOTIFS),
  unreadCount:  () => api.get(EP.UNREAD_COUNT),
  readAll:      () => api.patch(EP.READ_ALL),
};

export const savedService = {
  toggle: (id) => api.post(EP.SAVE(id)),
  getAll: ()   => api.get(EP.SAVED),
};

export const blockService = {
  toggle: (id) => api.post(EP.BLOCK(id)),
  getAll: ()   => api.get(EP.BLOCKED),
};

export const searchService = {
  all:   (q) => api.get(EP.SEARCH,       { params: { q } }),
  users: (q) => api.get(EP.SEARCH_USERS, { params: { q } }),
  posts: (q) => api.get(EP.SEARCH_POSTS, { params: { q } }),
};


