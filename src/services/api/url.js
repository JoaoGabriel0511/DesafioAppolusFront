export const baseUrl =
    process.env.NODE_ENV === "production"
        ? "url_producao"
        : "http://localhost:3000";