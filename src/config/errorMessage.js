const USER_ERROR_MESSAGES = {
  NO_PAYLOAD:
    "Update payload is missing. Provide at least one field to update.",
  ALLOWED_FIELD:
    "Update contains invalid fields. Only allowed fields can be updated.",
  USER_NOT_FOUND: "User not found in the system.",
  USER_UPDATED: "User information updated successfully.",
  USER_UPDATE_FAIL: "Update failed due to missing user or invalid update data",
};

module.exports = { USER_ERROR_MESSAGES };
