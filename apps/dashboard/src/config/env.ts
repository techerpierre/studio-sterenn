export default {
    API_BASE_URL: process.env.API_BASE_URL ?? 'http://localhost:3000',
    API_TOKEN_STORED_KEY: 'api_token',
    API_REFRESH_TOKEN_STORED_KEY: 'api_refresh_token',
    CURRENT_WORKSPACE_STORED_KEY: 'current_workspace',
} as const;
