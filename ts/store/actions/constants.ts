/**
 * All the actions related costants.
 */

// Application
export const APPLICATION_INITIALIZED: "APPLICATION_INITIALIZED" =
  "APPLICATION_INITIALIZED";
export const APP_STATE_CHANGE_ACTION: "APP_STATE_CHANGE_ACTION" =
  "APP_STATE_CHANGE_ACTION";

// Session
export const IDP_SELECTED: "IDP_SELECTED" = "IDP_SELECTED";
export const LOGIN_SUCCESS: "LOGIN_SUCCESS" = "LOGIN_SUCCESS";
export const LOGIN_FAILURE: "LOGIN_FAILURE" = "LOGIN_FAILURE";
export const SESSION_INITIALIZE_SUCCESS: "SESSION_INITIALIZE_SUCCESS" =
  "SESSION_INITIALIZE_SUCCESS";

// Onboarding
export const ONBOARDING_CHECK_TOS: "ONBOARDING_CHECK_TOS" =
  "ONBOARDING_CHECK_TOS";
export const ONBOARDING_CHECK_PIN: "ONBOARDING_CHECK_PIN" =
  "ONBOARDING_CHECK_PIN";
export const ONBOARDING_CHECK_COMPLETE: "ONBOARDING_CHECK_COMPLETE" =
  "ONBOARDING_CHECK_COMPLETE";
export const TOS_ACCEPT_REQUEST: "TOS_ACCEPT_REQUEST" = "TOS_ACCEPT_REQUEST";
export const TOS_ACCEPT_SUCCESS: "TOS_ACCEPT_SUCCESS" = "TOS_ACCEPT_SUCCESS";
export const PIN_CREATE_REQUEST: "PIN_CREATE_REQUEST" = "PIN_CREATE_REQUEST";
export const PIN_CREATE_SUCCESS: "PIN_CREATE_SUCCESS" = "PIN_CREATE_SUCCESS";
export const PIN_CREATE_FAILURE: "PIN_CREATE_FAILURE" = "PIN_CREATE_FAILURE";

// Notifications
export const NOTIFICATIONS_INSTALLATION_TOKEN_UPDATE: "NOTIFICATIONS_INSTALLATION_TOKEN_UPDATE" =
  "NOTIFICATIONS_INSTALLATION_TOKEN_UPDATE";
export const NOTIFICATIONS_INSTALLATION_UPDATE_FAILURE: "NOTIFICATIONS_INSTALLATION_UPDATE_FAILURE" =
  "NOTIFICATIONS_INSTALLATION_UPDATE_FAILURE";

// Profile
export const PROFILE_LOAD_REQUEST: "PROFILE_LOAD_REQUEST" =
  "PROFILE_LOAD_REQUEST";
export const PROFILE_LOAD_SUCCESS: "PROFILE_LOAD_SUCCESS" =
  "PROFILE_LOAD_SUCCESS";
export const PROFILE_LOAD_FAILURE: "PROFILE_LOAD_FAILURE" =
  "PROFILE_LOAD_FAILURE";

export const PROFILE_UPDATE_REQUEST: "PROFILE_UPDATE_REQUEST" =
  "PROFILE_UPDATE_REQUEST";
export const PROFILE_UPDATE_SUCCESS: "PROFILE_UPDATE_SUCCESS" =
  "PROFILE_UPDATE_SUCCESS";
export const PROFILE_UPDATE_FAILURE: "PROFILE_UPDATE_FAILURE" =
  "PROFILE_UPDATE_FAILURE";

// Messages
export const MESSAGES_LOAD_REQUEST: "MESSAGES_LOAD_REQUEST" =
  "MESSAGES_LOAD_REQUEST";
export const MESSAGES_LOAD_CANCEL: "MESSAGES_LOAD_CANCEL" =
  "MESSAGES_LOAD_CANCEL";
export const MESSAGES_LOAD_SUCCESS: "MESSAGES_LOAD_SUCCESS" =
  "MESSAGES_LOAD_SUCCESS";
export const MESSAGES_LOAD_FAILURE: "MESSAGES_LOAD_FAILURE" =
  "MESSAGES_LOAD_FAILURE";

export const MESSAGE_LOAD_SUCCESS: "MESSAGE_LOAD_SUCCESS" =
  "MESSAGE_LOAD_SUCCESS";

// Services
export const SERVICE_LOAD_SUCCESS: "SERVICE_LOAD_SUCCESS" =
  "SERVICE_LOAD_SUCCESS";

// Error
export const ERROR_CLEAR: "ERROR_CLEAR" = "ERROR_CLEAR";

// Costants for actions that need UI state reducers
export const FetchRequestActions = {
  PIN_CREATE: "PIN_CREATE",
  PROFILE_LOAD: "PROFILE_LOAD",
  PROFILE_UPDATE: "PROFILE_UPDATE",
  MESSAGES_LOAD: "MESSAGES_LOAD"
};

// Extract keys from object and create a new union type
export type FetchRequestActionsType = keyof typeof FetchRequestActions;
