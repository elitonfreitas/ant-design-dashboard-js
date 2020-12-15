import api from "./api";

class DefaultService {
  constructor() {
    this.api = api;
  }

  async autoLogin() {
    const data = {
      url: "/authenticate",
      method: "POST",
      headers: {
        "X-name": "Eliton Freitas",
        "X-registration": "TR621720",
        "X-profile": "Administrador",
        "X-psr": "128104450",
        "X-uf": "RJ",
        "cache-control": "no-cache",
      },
    };

    try {
      const result = await this.api(data);
      this.api.defaults.headers.Authorization = `Bearer ${result.data.data.token}`;
      localStorage.setItem("pgoi-token", `Bearer ${result.data.data.token}`);
    } catch (error) {
      console.log("Authenticate", error.response);
    }
  }

  async checkToken(error) {
    if (error.response) {
      const { data } = error.response;
      console.log(data);
      if (data && data.message.includes("jwt expired")) {
        await this.autoLogin();
      } else {
        const token = localStorage.getItem("pgoi-token");
        if (token) {
          this.api.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
          await this.autoLogin();
        }
      }
    }
  }

  async get(url, errorResponse = {}) {
    try {
      const result = await this.api.get(url);
      return result.data;
    } catch (error) {
      await this.checkToken(error);
      return { data: errorResponse };
    }
  }
}

export default new DefaultService();
