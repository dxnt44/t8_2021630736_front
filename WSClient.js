class WSClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.apiKey = "aZ4FIk0trDYsSalnPaddPQzCIBQKKUbpxI85qWbzLaHjAzFu4TKsnA=="; // Reemplaza con la clave copiada desde Azure
    }

    async postJson(endpoint, body) {
        // Determina si usar '?' o '&' para agregar el parámetro 'code'
        const separator = endpoint.includes("?") ? "&" : "?";
        const url = `${this.baseURL}/${endpoint}${separator}code=${this.apiKey}`;

        const response = await fetch(url, {
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
        // Determina si usar '?' o '&' para agregar el parámetro 'code'
        const separator = endpoint.includes("?") ? "&" : "?";
        const url = `${this.baseURL}/${endpoint}${separator}code=${this.apiKey}`;

        const response = await fetch(url, {
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
