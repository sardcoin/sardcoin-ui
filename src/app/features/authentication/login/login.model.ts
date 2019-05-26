export interface Credentials {
  username?: string;
  password?: string;
}

export interface LoginState {
  token: string;
  hasError: boolean;
  isLoading: boolean;
  isLogged: boolean;
}

export const LOGIN_INITIAL_STATE: LoginState = {
  token: null,
  hasError: false,
  isLoading: false,
  isLogged: false
};
