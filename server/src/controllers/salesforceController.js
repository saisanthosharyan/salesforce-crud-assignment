import {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../services/salesforceService.js";

function handleError(res, error) {
  console.error(
    "Salesforce API error:",
    error.response?.data || error.message
  );

  const status = error.message === "Salesforce authentication required"
    ? 401
    : 500;

  res.status(status).json({
    success: false,
    message: error.response?.data?.[0]?.message || error.message,
  });
}

export async function listRecords(req, res) {
  try {
    const { objectName } = req.params;

    const pageSize = Math.min(
      Math.max(Number(req.query.pageSize) || 20, 1),
      20
    );

    const data = await getRecords(req.session, objectName, pageSize);

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    handleError(res, error);
  }
}

export async function getSingleRecord(req, res) {
  try {
    const { objectName, recordId } = req.params;

    const record = await getRecord(
      req.session,
      objectName,
      recordId
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      record,
    });
  } catch (error) {
    handleError(res, error);
  }
}

export async function createNewRecord(req, res) {
  try {
    const { objectName } = req.params;

    const result = await createRecord(
      req.session,
      objectName,
      req.body
    );

    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    handleError(res, error);
  }
}

export async function updateExistingRecord(req, res) {
  try {
    const { objectName, recordId } = req.params;

    const result = await updateRecord(
      req.session,
      objectName,
      recordId,
      req.body
    );

    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

export async function deleteExistingRecord(req, res) {
  try {
    const { objectName, recordId } = req.params;

    const result = await deleteRecord(
      req.session,
      objectName,
      recordId
    );

    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}