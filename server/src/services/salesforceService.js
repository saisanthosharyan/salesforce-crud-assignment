import axios from "axios";

import {
  getObjectFields,
  isValidObject,
} from "../config/salesforceObjects.js";

function getSalesforceClient(session) {
  if (!session?.salesforce?.accessToken || !session?.salesforce?.instanceUrl) {
    throw new Error("Salesforce authentication required");
  }

  return axios.create({
    baseURL: `${session.salesforce.instanceUrl}/services/data/v68.0`,
    headers: {
      Authorization: `Bearer ${session.salesforce.accessToken}`,
      "Content-Type": "application/json",
    },
  });
}

export async function getRecords(session, objectName, pageSize = 20) {
  if (!isValidObject(objectName)) {
    throw new Error("Invalid Salesforce object");
  }

  const client = getSalesforceClient(session);
  const fields = getObjectFields(objectName);

  const query = `
    SELECT ${fields.join(", ")}
    FROM ${objectName}
    ORDER BY CreatedDate DESC
    LIMIT ${pageSize}
  `;

  const response = await client.get("/query", {
    params: {
      q: query,
    },
  });

  return response.data;
}

export async function getRecord(session, objectName, recordId) {
  if (!isValidObject(objectName)) {
    throw new Error("Invalid Salesforce object");
  }

  const client = getSalesforceClient(session);
  const fields = getObjectFields(objectName);

  const query = `
    SELECT ${fields.join(", ")}
    FROM ${objectName}
    WHERE Id = '${recordId}'
    LIMIT 1
  `;

  const response = await client.get("/query", {
    params: {
      q: query,
    },
  });

  return response.data.records?.[0] || null;
}

export async function createRecord(session, objectName, data) {
  if (!isValidObject(objectName)) {
    throw new Error("Invalid Salesforce object");
  }

  const client = getSalesforceClient(session);

  const response = await client.post(`/${objectName}`, data);

  return response.data;
}

export async function updateRecord(session, objectName, recordId, data) {
  if (!isValidObject(objectName)) {
    throw new Error("Invalid Salesforce object");
  }

  const client = getSalesforceClient(session);

  await client.patch(`/${objectName}/${recordId}`, data);

  return {
    success: true,
    id: recordId,
  };
}

export async function deleteRecord(session, objectName, recordId) {
  if (!isValidObject(objectName)) {
    throw new Error("Invalid Salesforce object");
  }

  const client = getSalesforceClient(session);

  await client.delete(`/${objectName}/${recordId}`);

  return {
    success: true,
    id: recordId,
  };
}