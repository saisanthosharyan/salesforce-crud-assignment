import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export const salesforceConfig = {
  loginUrl:
    process.env.SALESFORCE_LOGIN_URL || "https://login.salesforce.com",

  clientId: process.env.SALESFORCE_CLIENT_ID,

  clientSecret: process.env.SALESFORCE_CLIENT_SECRET,

  callbackUrl:
    process.env.SALESFORCE_CALLBACK_URL ||
    "http://localhost:5000/auth/salesforce/callback",

  apiVersion: process.env.SALESFORCE_API_VERSION || "v68.0",
};

export function validateSalesforceConfig() {
  const required = [
    ["SALESFORCE_CLIENT_ID", salesforceConfig.clientId],
    ["SALESFORCE_CLIENT_SECRET", salesforceConfig.clientSecret],
    ["SALESFORCE_CALLBACK_URL", salesforceConfig.callbackUrl],
  ];

  const missing = required
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Missing Salesforce environment variables: ${missing.join(", ")}`
    );
  }
}
