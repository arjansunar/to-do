import useSWR from "swr";
import { fetcher } from "../../apiUtils";

const Todo = ({ user }) => {
  const { data, error } = useSWR(`/api/user/${user}`, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status === 404) return;

      // Never retry for a specific key.
      if (key === "/api/user") return;

      // Only retry up to 10 times.
      if (retryCount >= 5) return;

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
  });

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  console.log(data, error);

  const todoList = data?.todos;
  return (
    <div className=" bg-gray-200 text-gray-800 flex flex-col  items-center h-screen pt-24  ">
      {/* user name  */}
      <h2 className="font-bold text-xl uppercase italic mb-4">
        {`${user}'s Todo`}{" "}
      </h2>
      {/* todo container */}
      <div className="container px-3 max-w-md mx-auto">
        {/* todo wrapper */}
        <div className="bg-white rounded shadow px-4 py-4">
          <div className="title font-bold text-lg">Todo Application</div>
          <div className="flex items-center text-sm mt-2">
            <button
            // @click="$refs.addTask.focus()"
            >
              <svg
                className="w-3 h-3 mr-3 focus:outline-none"
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
            <span>Click to add task</span>
          </div>
          <input
            type="text"
            placeholder="what is your plan for today"
            className=" rounded-sm shadow-sm px-4 py-2 border border-gray-200 w-full mt-4"
            //  @keydown.enter="addTodo()"
          />

          {/* Todo list */}
          <ul className="todo-list mt-4">
            {/* todo list  */}
            {todoList.map((todo) => (
              <TodoItem key={todo.id} todo={todo}>
                {todo.task}
              </TodoItem>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const TodoItem = ({ todo }) => {
  return (
    <li
      className="flex justify-between items-center mt-3"
      x-show="todo.title !== ''"
    >
      <div
        className="flex items-center"
        // :className="{'line-through' : todo.isComplete}"
      >
        <input type="checkbox" name="" id="" x-model="todo.isComplete" />
        <div className="capitalize ml-3 text-sm font-semibold">{todo.task}</div>
      </div>
      <div>
        <button>
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
  );
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
