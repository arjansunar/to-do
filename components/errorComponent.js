import { BackBtn } from "./backButton";

export const Error = ({ message }) => {
  return (
    <div className="bg-black font-sans text-white text-sm flex h-screen  items-center justify-center">
      <BackBtn dark />
      <span className="text-xl font-bold ">404</span>{" "}
      <span className="w-px h-10 bg-white mx-2"></span>
      {message}
    </div>
  );
};
