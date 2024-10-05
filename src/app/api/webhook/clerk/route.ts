// api/webhook/clerk/route.ts

import { db } from "@/server/db";

export const POST = async (req: Request) => {
  try {
    // const body = await req.json();
    // console.log("Request body:", body);

    // if (!body || !body.data) {
    //   throw new Error("Request body is missing 'data' field.");
    // }
    const { data } = await req.json();
    const emailAddress = data.email_addresses[0].email_address;
    const firstName = data.first_name;
    const lastName = data.last_name;
    const imageUrl = data.image_url;
    const id = data.id;

    await db.user.create({
      data: {
        id: id,
        emailAddress: emailAddress,
        firstName: firstName,
        lastName: lastName,
        imageUrl: imageUrl,
      },
    });
    console.log("User created: " + emailAddress);

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response("Error handling request", {
      status: 500,
    });
  }
};
