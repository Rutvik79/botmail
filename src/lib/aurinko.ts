"use server";

import axios from "axios";
import { auth } from "@clerk/nextjs/server";

export const getAurinkoAuthUrl = async (
  serviceType: "Google" | "Office365",
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const params = new URLSearchParams({
    clientId: (process.env.AURINKO_CLIENT_ID as string) || "",
    serviceType,
    scopes: "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
    responseType: "code",
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
  });

  return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
};

export const exchangeCodeForAccessToken = async (code: string) => {
  try {
    const response = await axios.post(
      `https://api.aurinko.io/v1/auth/token/${code}`,
      {},
      {
        auth: {
          username: process.env.AURINKO_CLIENT_ID as string,
          password: process.env.AURINKO_CLIENT_SECRET as string,
        },
      },
    );

    console.log("from exchangeCodeForAccessToken");
    console.log(
      `response from exchangeCodeForAccessToken: accountId: ${response.data.accountId}, accessToken: ${response.data.accessToken}, userId: ${response.data.userId}, userSession: ${response.data.userSession}`,
    );
    return response.data as {
      accountId: number;
      accessToken: string;
      userId: string;
      userSession: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching Aurinko token:", error.response?.data);
    }
    console.error("Unexpected error fetching Aurinko token", error);
  }
};

export const getAccountDetails = async (accessToken: string) => {
  try {
    console.log("inside get account details");
    const response = await axios.get("https://api.aurinko.io/v1/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(`response from getAccountDetails: ${response.data}`);
    return response.data as {
      email: string;
      name: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching account details:", error.response?.data);
    } else {
      console.error("Unexpected error fetching account details:", error);
    }
    throw error;
  }
};
