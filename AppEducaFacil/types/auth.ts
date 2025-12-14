import { UserDataReceived } from "./header-types";

export interface AuthState {
  user: UserDataReceived | null;
  token: string | null;
  isAuthenticated: boolean;
}