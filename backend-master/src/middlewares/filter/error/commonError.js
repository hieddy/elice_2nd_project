const commonErrors = {
  authenticationError: `Authentication Error`, // 401
  authorizationError: `Authorization Error`, // 403
  inputError: `Input Error`, // 400
  argumentError: `Argument Error`, // 400
  businessError: `Business Error`, // 400
  configError: `Config Error`, // 400
  dbConnectionError: `DB Connection Error`, // 500
  databaseError: `DB Error`,
  fatalError: `Fatal Error`,
  objectCreationError: `Object Creation Error`,
  resourceNotFoundError: `Resource Not Found Error`,
  resourceDuplicationError: `Resource Duplication Error`,
  remoteStorageError: `Remote Storage Error`,
  requestValidationError: 'Request Validation Error',
};

export default commonErrors;
