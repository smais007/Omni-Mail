import { db } from "./server/db";

try {
  await db.user.create({
    data: {
      emailAddress: "smais@example.com",
      firstName: "John",
      lastName: "Deo",
    },
  });

  console.log("Done");
} catch (error) {
  console.error("Error creating user:", error);
}
