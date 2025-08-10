// /api/clerk/webhook

import { db } from "@/server/db";
import { set } from "zod";

export const POST = async (req: Request) => {
  const { data } = await req.json();

  const emailAddress =
    data.email_addresses && data.email_addresses.length > 0
      ? data.email_addresses[0].emailAddress
      : "test@example.com";
  const firstName = data.first_name;
  const lastName = data.last_name;
  const imageUrl = data.profile_image_url;
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

  console.log("User created in database:", { id, emailAddress });
  await new Promise((r) => setTimeout(r, 0));
  return new Response("webhook received", {
    status: 200,
  });
};
