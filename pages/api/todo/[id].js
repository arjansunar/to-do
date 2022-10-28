import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default async function getTodos(req, res) {
  const {
    method,
    body,
    query: { id },
  } = req;

  console.log(body);
  switch (method) {
    case "PATCH":
      try {
        // get todo from your database
        const todo = await prisma.todoItem.update({
          data: {
            done: body.done,
          },
          where: {
            id: +id,
          },
        });

        res.status(200).json(todo);
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
      break;
    case "DELETE":
      try {
        // delete todo from your database
        await prisma.todoItem.delete({
          where: {
            id: +id,
          },
        });
        res.status(200).json({ deleted: true });
      } catch (error) {
        res.status(404).json({ error: error.message });
      }

    default:
      res.setHeader("Allow", ["PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
