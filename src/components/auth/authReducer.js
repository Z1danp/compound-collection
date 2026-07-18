export const initialState = {
  status: 'loading',
  user: null,
  error: null,
};

export function authReducer(state, action) {
  switch (action.type) {
    case 'CHECK_START':
    case 'LOGIN_START':
      return {
        status: 'loading',
        user: null,
        error: null,
      };
    case 'CHECK_SUCCESS':
    case 'LOGIN_SUCCESS':
      return {
        status: 'authenticated',
        user: action.payload,
        error: null,
      };
    case 'CHECK_FAIL':
    case 'LOGOUT':
      return {
        status: 'unauthenticated',
        user: null,
        error: null,
      };
    case 'LOGIN_FAIL':
      return {
        status: 'error',
        user: null,
        error: action.payload,
      };
    default:
      return state;
  }
}
