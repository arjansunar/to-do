import axios from "axios";

export const updateTodo = (id, done) =>
  axios.patch(`/api/todo/${id}`, {
    method: "PATCH",
    body: { done: done },
  });

export const deleteTodo = (id) =>
  axios.delete(`/api/todo/${id}`).then((res) => res.data);
