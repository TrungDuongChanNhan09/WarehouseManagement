import axios from "axios";

export default class ApiService {
    static BASE_URL = "http://localhost:6060";

    // Từ
    static getHeader() {
        const token = localStorage.getItem("jwt");  
        if (!token) {
            throw new Error("Token không tồn tại trong localStorage.");  
        }
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }
    static async loginUser(loginDetails) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/signin`, loginDetails);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    static async logout() {
        try {
            const response = await axios.post(
                `${this.BASE_URL}/auth/logout`,
                {}, 
                { headers: this.getHeader() } 
            );

            localStorage.removeItem("jwt");
            localStorage.removeItem("role");

            return response.data; 
        } catch (error) {
            throw error; 
        }
    }
    static async getAllInventory() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/admin/inventory`, {
                headers: this.getHeader()  
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    static async addInventory(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/admin/inventory`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }

    static async deleteInventory(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/admin/inventory/${id}`, {
                headers: this.getHeader(),
            });
            return response.data; 
        } catch (error) {
            console.error("Lỗi khi xóa:", error.response?.data || error.message);
            throw error;
        }
    }

    static async updateInventory(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/admin/inventory/${id}`, formData, {
                headers: this.getHeader(),
                'Content-Type': 'application/json' 
            });
            return response.data;
        } catch (error) {
            throw error;  
        }
    }
    

    // Phát
    static async getAllProduct() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/product`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getAllSupplier() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/supplier`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Tân
}
