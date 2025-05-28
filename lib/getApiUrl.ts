export const getApiUrl = () => {
  const mode = process.env.NEXT_PUBLIC_MODE || "local";
  return mode === "prod"
    ? process.env.NEXT_PUBLIC_PROD_SERVER
    : mode === "dev"
    ? process.env.NEXT_PUBLIC_DEV_SERVER
    : process.env.NEXT_PUBLIC_LOCAL_SERVER || "http://localhost:8080";
};
