import { useCallback, useEffect, useState } from "react";

const initError = {
  message: "",
  err: false,
};
export default function Home() {
  const [user, setUser] = useState("");
  const [error, setError] = useState(initError);

  const verify = useCallback(() => {
    return user.length >= 3;
  }, [user]);

  useEffect(() => {
    const isValid = verify(user);

    if (!isValid) {
      setError({
        message: "Name must be of more than 2 letters",
        err: true,
      });
    } else {
      setError(initError);
    }
  }, [user, verify]);

  const handleUserSubmission = () => {
    if (error.err) {
      console.error(error);
      return;
    }
    // call api after verification
    console.log(user);
    fetch();
  };

  return (
    <div className=" bg-gray-200 text-gray-800 flex flex-col  items-center h-screen pt-24  ">
      <h2 className="font-bold text-xl uppercase italic mb-4">Todo app </h2>
      <div className="container px-3 max-w-md mx-auto">
        <div className="bg-white rounded shadow px-4 py-4 flex flex-col">
          <div className="title font-bold text-lg">Enter User name</div>
          <input
            type="text"
            placeholder="User name"
            className=" rounded-sm shadow-sm px-4 py-2 border border-gray-200 w-full mt-4"
            onChange={(name) => setUser(name.target.value)}
            //  @keydown.enter="addTodo()"
          />
          <button
            onClick={handleUserSubmission}
            className="px-6 py-1 bg-black text-gray-100 rounded mt-5 max-w-fit self-end"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
