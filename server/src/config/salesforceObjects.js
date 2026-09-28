export const salesforceObjects = {
  Account: {
    fields: ["Id", "Name", "Industry", "Phone", "Website", "Type"],
  },

  Opportunity: {
    fields: [
      "Id",
      "Name",
      "Amount",
      "StageName",
      "CloseDate",
      "Probability",
    ],
  },

  Lead: {
    fields: ["Id", "FirstName", "LastName", "Company", "Email", "Status"],
  },

  Contact: {
    fields: ["Id", "FirstName", "LastName", "Email", "Phone", "AccountId"],
  },

  Case: {
    fields: ["Id", "CaseNumber", "Subject", "Status", "Priority", "Origin"],
  },
};

export function isValidObject(objectName) {
  return Object.prototype.hasOwnProperty.call(
    salesforceObjects,
    objectName
  );
}

export function getObjectFields(objectName) {
  return salesforceObjects[objectName]?.fields || [];
}