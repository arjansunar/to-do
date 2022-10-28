import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function userHandler(req, res) {
  const {
    query: { userName },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        // get todo from your database
        const todos = await prisma.user.findUniqueOrThrow({
          where: {
            name: userName,
          },
          include: {
            todos: true,
          },
        });

        res.status(200).json({ todos });
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
