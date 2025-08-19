// /api/clerk/webhook

import { db } from "@/server/db";

export const POST = async (req: Request) => {
  const { data } = await req.json();
  // console.log("data from clerk webhook endpoint", data);
  const emailAddress =
    data.email_addresses && data.email_addresses.length > 0
      ? data.email_addresses[0].email_address
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

  return new Response("webhook received", {
    status: 200,
  });
};
