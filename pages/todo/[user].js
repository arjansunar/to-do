import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import {
  fetcher,
  updateTodo as todoUpdater,
  deleteTodo as todoDeleter,
  createTodo,
} from "../../apiUtils";
import { BackBtn } from "../../components/backButton";
import { Error } from "../../components/errorComponent";
import { Loading } from "../../components/loadingComponent";

const Todo = ({ user }) => {
  const [task, setTask] = useState("");

  const { data: todoList, error } = useSWR(`/api/user/${user}`, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.response.status === 404) {
        return;
      }

      // Never retry for a specific key.
      if (key === "/api/user") return;

      // Only retry up to 10 times.
      if (retryCount >= 5) return;

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });

  if (error) {
    return <Error message={error.response.data.error}></Error>;
  }
  if (!todoList) return <Loading>loading...</Loading>;

  const handleCreateTodo = () => {
    mutate(
      `/api/user/${user}`,
      async (todos) => {
        const { data: newTodo } = await createTodo(task, user);
        return [...todos, newTodo];
      },
      { revalidate: false }
    );
    setTask("");
  };

  return (
    <div className=" bg-gray-200 text-gray-800 flex flex-col  items-center h-screen pt-24">
      <BackBtn />
      {/* user name  */}
      <h2 className="font-bold text-xl uppercase italic mb-4">
        {`${user}'s Todo`}{" "}
      </h2>
      {/* todo container */}
      <div className="container px-3 max-w-md mx-auto">
        {/* todo wrapper */}
        <div className="bg-white rounded shadow px-4 py-4">
          <div className="title font-bold text-lg">Todo Application</div>
          <div className="flex items-center justify-center text-sm mt-4 gap-3">
            <input
              type="text"
              placeholder="what is your plan for today"
              className=" rounded-sm shadow-sm px-4 py-2 border border-gray-200 w-full"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button onClick={handleCreateTodo}>
              <svg
                className="w-3 h-3  focus:outline-none"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>

          {/* Todo list */}
          <ul className="todo-list mt-4">
            {/* todo list  */}

            {todoList ? (
              todoList.map((todo) => (
                <TodoItem key={todo.id} todo={todo} user={user}>
                  {todo.task}
                </TodoItem>
              ))
            ) : (
              <div>No items</div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const TodoItem = ({ todo, user }) => {
  const [done, setDone] = useState(todo.done);
  const handleUpdate = () => {
    // call the api and revalidates cache
    mutate(
      `/api/user/${user}`,
      async (todos) => {
        const { data: updatedTodo } = await todoUpdater(todo.id, !done);
        const index = todos.findIndex((el) => el.id === todo.id);
        console.log({ done, updatedTodo });
        todos[index] = updatedTodo;
        return [...todos];
      },
      { revalidate: false }
    );
    setDone(!done);
  };

  const handleDelete = () => {
    // call the api and revalidates cache
    mutate(
      `/api/user/${user}`,
      async (todos) => {
        todoDeleter(todo.id);
        const filteredTodos = todos.filter((el) => el.id !== todo.id);
        return [...filteredTodos];
      },
      { revalidate: false }
    );
  };
  return todo.task ? (
    <li className="flex justify-between items-center mt-3">
      <div className={`${done ? "line-through" : ""} flex items-center`}>
        <input
          type="checkbox"
          name="done"
          id={todo.id}
          checked={done}
          onChange={() => handleUpdate()}
        />
        <label
          className="capitalize ml-3 text-sm font-semibold"
          htmlFor={todo.id}
        >
          {todo.task}
        </label>
      </div>
      <div>
        <button onClick={() => handleDelete()}>
          <svg
            className=" w-4 h-4 text-gray-600 fill-current"
            // @click="deleteTodo(todo.id)"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </li>
  ) : null;
};

export default Todo;

export async function getServerSideProps(context) {
  // getting route param --> user name
  const user = context.query.user;

  return {
    props: {
      user,
    },
  };
}
