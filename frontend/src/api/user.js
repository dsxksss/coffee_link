import axios from "axios";

// 用户相关API请求
const userAPI = {
    getPageMaxCount: async () => {
        const result = await axios.get(`http://localhost:3001/user`);
        return Math.ceil(result.data.length / 5);
    },
    // 获取所有用户
    getAllUsers: () => axios.get(`http://localhost:3001/user`),
    // 分页获取用户
    getUsers: (page = 1, limit = 5) => axios.get(`http://localhost:3001/user?page=${page}&limit=${limit}`),
    // 获取单个用户
    getUserById: (id) => axios.get(`http://localhost:3001/user/${id}`),
    // 创建用户
    createUser: (userData) => axios.post('http://localhost:3001/user', userData),
    // 更新用户
    updateUser: (id, userData) => axios.put(`http://localhost:3001/user/${id}`, userData),
    // 删除用户
    deleteUser: (id) => axios.delete(`http://localhost:3001/user/${id}`)
};

export default userAPI;