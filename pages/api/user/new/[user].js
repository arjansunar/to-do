import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function newUserHandler(req, res) {
  const {
    query: { user },
    method,
  } = req;

  switch (method) {
    case "POST":
      try {
        // get todo from your database
        const newUser = await prisma.user.create({
          data: {
            name: user,
          },
        });
        res.status(200).json(newUser);
        break;
      } catch (error) {
        if (error.code === "P2002") {
          res
            .status(404)
            .json({ error: "User already exists", status: "P2002" });
          break;
        }
        res.status(404).json({ error: error.message });
        break;
      }

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
