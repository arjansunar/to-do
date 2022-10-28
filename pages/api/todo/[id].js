import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default async function getTodos(req, res) {
  const {
    method,
    body,
    query: { id },
  } = req;

  switch (method) {
    case "PATCH":
      const { done } = body;
      try {
        // get todo from your database
        const todo = await prisma.todoItem.update({
          data: {
            done,
          },
          where: {
            id: +id,
          },
        });
        res.status(200).json(todo);
        break;
      } catch (error) {
        res.status(404).json({ error: error.message });
        break;
      }
    case "DELETE":
      try {
        // delete todo from your database
        const deletedTodo = await prisma.todoItem.delete({
          where: {
            id: +id,
          },
        });
        res.status(200).json(deletedTodo);
        break;
      } catch (error) {
        res.status(404).json({ error: error.message });
        break;
      }

    default:
      res.setHeader("Allow", ["PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
