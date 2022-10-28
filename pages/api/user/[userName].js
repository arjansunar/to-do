import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function userHandler(req, res) {
  const {
    query: { userName },
    body,
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        // get todo from your database
        const { todos } = await prisma.user.findUniqueOrThrow({
          where: {
            name: userName,
          },
          include: {
            todos: {
              orderBy: {
                id: "asc",
              },
            },
          },
        });

        res.status(200).json(todos);
        break;
      } catch (error) {
        res.status(404).json({ error: error.message });
        break;
      }
    case "POST":
      const { task } = body;
      try {
        // get todo from your database
        const newTodo = await prisma.todoItem.create({
          data: {
            ownerId: userName,
            task,
          },
        });
        res.status(200).json(newTodo);
        break;
      } catch (error) {
        res.status(404).json({ error: error.message });
        break;
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
