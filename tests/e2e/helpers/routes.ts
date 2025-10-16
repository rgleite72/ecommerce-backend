export const API = process.env.API_PREFIX || "/api";

export const ROUTES = {
  AUTH: `${API}/auth`,
  USERS: `${API}/users`,
  ADMIN_USERS: `${API}/admin/users`,
  CUSTOMERS: `${API}/customers`,
  ADDRESS: `${API}/address`, // seu router atual
};