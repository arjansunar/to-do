import axios from "axios";

export const updateTodo = (id, done) => {
  return axios.patch(`/api/todo/${id}`, {
    done,
  });
};

export const createTodo = (task, ownerId) => {
  return axios.post(`/api/user/${ownerId}`, {
    task,
  });
};

export const deleteTodo = (id) =>
  axios.delete(`/api/todo/${id}`).then((res) => res.data);
