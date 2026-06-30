const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const get = (url) => fetch(`${BASE}${url}`, { headers: authHeaders() }).then((r) => r.json());
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("admin_token")}` });
const post = (url, body) => fetch(`${BASE}${url}`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) }).then((r) => r.json());
const put = (url, body) => fetch(`${BASE}${url}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(body) }).then((r) => r.json());
const del = (url) => fetch(`${BASE}${url}`, { method: "DELETE", headers: authHeaders() }).then((r) => r.json());
const upload = (url, formData) => fetch(`${BASE}${url}`, { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }, body: formData }).then((r) => r.json());
const uploadPut = (url, formData) => fetch(`${BASE}${url}`, { method: "PUT", headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` }, body: formData }).then((r) => r.json());

export const api = { get, post, put, del, upload, uploadPut };
