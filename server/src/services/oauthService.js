import axios from "axios";
import { salesforceConfig, validateSalesforceConfig } from "../config/salesforce.js";

export function buildSalesforceAuthorizationUrl(state) {
  validateSalesforceConfig();

  const params = new URLSearchParams({
    response_type: "code",
    client_id: salesforceConfig.clientId,
    redirect_uri: salesforceConfig.callbackUrl,
    state,
  });

  return `${salesforceConfig.loginUrl}/services/oauth2/authorize?${params.toString()}`;
}

export async function exchangeAuthorizationCode(code) {
  validateSalesforceConfig();

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: salesforceConfig.clientId,
    client_secret: salesforceConfig.clientSecret,
    redirect_uri: salesforceConfig.callbackUrl,
  });

  const response = await axios.post(
    `${salesforceConfig.loginUrl}/services/oauth2/token`,
    params.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}

export async function refreshSalesforceToken(refreshToken) {
  validateSalesforceConfig();

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: salesforceConfig.clientId,
    client_secret: salesforceConfig.clientSecret,
  });

  const response = await axios.post(
    `${salesforceConfig.loginUrl}/services/oauth2/token`,
    params.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}