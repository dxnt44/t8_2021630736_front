class WSClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async postJson(endpoint, data) {
        const response = await fetch(`${this.baseURL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }
        return response.json();
    }

    async getJson(endpoint) {
        const response = await fetch(`${this.baseURL}/${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }
        return response.json();
    }
}

const cliente = new WSClient("https://t8-2021630736-a.azurewebsites.net/api");
