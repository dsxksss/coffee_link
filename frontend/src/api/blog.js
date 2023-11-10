import axios from "axios";

// 博客相关API请求
const blogAPI = {
    getPageMaxCount: async () => {
        const result = await axios.get(`http://localhost:3001/blog`);
        return Math.ceil(result.data.length / 5);
    },
    // 获取所有博客
    getAllBlogs: () => axios.get('http://localhost:3001/blog'),
    // 分页获取博客
    getBlogs: (page = 1, limit = 5) => axios.get(`http://localhost:3001/blog?page=${page}&limit=${limit}`),
    // 获取单个博客
    getBlogById: (id) => axios.get(`http://localhost:3001/blog/${id}`),
    // 创建博客
    createBlog: (blogData) => axios.post('http://localhost:3001/blog', blogData),
    // 更新博客
    updateBlog: (id, blogData) => axios.put(`http://localhost:3001/blog/${id}`, blogData),
    // 删除博客
    deleteBlog: (id) => axios.delete(`http://localhost:3001/blog/${id}`)
};

export default blogAPI;