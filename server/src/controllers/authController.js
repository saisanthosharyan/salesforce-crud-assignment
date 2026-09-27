import crypto from "crypto";

import {
  buildSalesforceAuthorizationUrl,
  exchangeAuthorizationCode,
} from "../services/oauthService.js";

export function loginWithSalesforce(req, res) {
  try {
    const state = crypto.randomBytes(32).toString("hex");

    req.session.oauthState = state;

    const authorizationUrl = buildSalesforceAuthorizationUrl(state);

    res.redirect(authorizationUrl);
  } catch (error) {
    console.error("Salesforce login error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to start Salesforce authentication",
    });
  }
}

export async function salesforceCallback(req, res) {
  const { code, state, error, error_description } = req.query;

  if (error) {
    console.error("Salesforce OAuth error:", error, error_description);

    return res.status(400).json({
      success: false,
      message: error_description || error,
    });
  }

  if (!state || state !== req.session.oauthState) {
    return res.status(400).json({
      success: false,
      message: "Invalid OAuth state",
    });
  }

  delete req.session.oauthState;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Authorization code was not provided",
    });
  }

  try {
    const tokenData = await exchangeAuthorizationCode(code);

    req.session.salesforce = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || null,
      instanceUrl: tokenData.instance_url,
      issuedAt: Date.now(),
      signature: tokenData.signature || null,
    };

    const clientUrl =
      process.env.CLIENT_URL || "http://localhost:5173";

    res.redirect(`${clientUrl}/dashboard`);
  } catch (error) {
    console.error(
      "Salesforce token exchange failed:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to exchange Salesforce authorization code",
    });
  }
}

export function getAuthStatus(req, res) {
  const salesforce = req.session.salesforce;

  res.json({
    authenticated: Boolean(salesforce?.accessToken),
  });
}

export function logout(req, res) {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to logout",
      });
    }

    res.clearCookie("connect.sid");

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
}