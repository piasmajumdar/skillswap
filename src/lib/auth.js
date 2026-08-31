import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("skillswap");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "client",
      },

      skills: {
        type: "string",
        required: false,
      },

      bio: {
        type: "string",
        required: false,
      },

      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
});
