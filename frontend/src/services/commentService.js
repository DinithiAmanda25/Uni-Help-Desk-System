import API from "./api";

export const addComment = (data) =>
  API.post("/comments", data);

export const getComments = (ticketId) =>
  API.get(`/comments/${ticketId}`);