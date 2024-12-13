class WSClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.apiKey = "YM-gz1dfblamMKf2rcx7Hpn638kEikuo73UPRPuwHTBMAzFufn9DSg=="; // Reemplaza con la clave copiada desde Azure
    }

    async postJson(endpoint, body) {
        const response = await fetch(`${this.baseURL}/${endpoint}?code=${this.apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return response.json();
    }

    async getJson(endpoint) {
        const response = await fetch(`${this.baseURL}/${endpoint}?code=${this.apiKey}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return response.json();
    }
}

