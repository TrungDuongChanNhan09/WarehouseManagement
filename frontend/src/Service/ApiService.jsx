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

    static async getAllShelf() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/shelf/all`, {
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


    // Tân
    //order
    static async getAllOrders() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/admin/order`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhân viên:", error.response?.data || error.message);
            throw error;
        }
    }
    //employee
    static async getAllEmployees() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/admin/user`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhân viên:", error.response?.data || error.message);
            throw error;
        }
    }
    static async addEmployee(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/admin/user`, formData, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thêm nhân viên:", error.response?.data || error.message);
            throw error;
        }
    }
    static async updateEmployee(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/admin/user/${id}`, formData, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin nhân viên:", error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteEmployee(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/admin/user/${id}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa nhân viên:", error.response?.data || error.message);
            throw error;
        }
    }
    //Category
    static async getAllCategory() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/category`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách :", error.response?.data || error.message);
            throw error;
        }
    }
    static async addCategory(formData) {
        try {
            const response = await axios.post(`${this.BASE_URL}/api/admin/category`, formData, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error.response?.data || error.message);
            throw error;
        }
    }
    static async updateCategory(id, formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/api/admin/category/${id}`, formData, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin nhân viên:", error.response?.data || error.message);
            throw error;
        }
    }
    static async deleteCategory(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/admin/category/${id}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa nhân viên:", error.response?.data || error.message);
            throw error;
        }
    }
    //Order
}
