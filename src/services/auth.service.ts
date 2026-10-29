import { apiRequest } from "@/src/lib/api";
import type {
  LoginPayload,
  LoginResponse,
} from "@/src/types/auth.types";

export const authService = {
  login(payload: LoginPayload): Promise<LoginResponse> {
  
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });
  },
};