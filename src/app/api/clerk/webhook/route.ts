// /api/clerk/webhook

import { db } from "@/server/db";

export const POST = async (req: Request) => {
  const { data } = await req.json();

  const emailAddress = data.email_addresses[0].emailAddress; // Replace with actual email extraction logic
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
  console.log("User created in database:", {
    id,
    emailAddress,
    firstName,
    lastName,
    imageUrl,
  });
  return new Response("webhook received", {
    status: 200,
  });
};
