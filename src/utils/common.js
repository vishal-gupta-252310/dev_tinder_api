const toCheckAllowedFields = (list, payload) => {
  const isAllowed = Object.keys(payload).every((k) => list.includes(k));
  return isAllowed;
};

module.exports = { toCheckAllowedFields };
