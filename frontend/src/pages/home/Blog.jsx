import React from 'react'
import { Link } from 'react-router-dom';
import news1 from '../../assets/news/news-1.png';
import news2 from '../../assets/news/news-2.png';
import news3 from '../../assets/news/news-3.png';
import news4 from '../../assets/news/news-4.png';

const blogPosts = [
    {
        id: 1,
        title: "Top 10 cuốn sách hay nhất năm 2024",
        excerpt: "Khám phá những cuốn sách được yêu thích nhất trong năm với đánh giá cao từ độc giả trên toàn thế giới.",
        image: news1,
        date: "March 1, 2026",
        category: "Đánh giá"
    },
    {
        id: 2,
        title: "Cách xây dựng thói quen đọc sách hiệu quả",
        excerpt: "Bí quyết giúp bạn duy trì thói quen đọc sách mỗi ngày và tận hưởng những giá trị từ việc đọc.",
        image: news2,
        date: "March 5, 2026",
        category: "Hướng dẫn"
    },
    {
        id: 3,
        title: "Những tác giả nổi tiếng và tác phẩm kinh điển",
        excerpt: "Tìm hiểu về các tác giả vĩ đại và những tác phẩm văn học kinh điển không thể bỏ qua.",
        image: news3,
        date: "March 8, 2026",
        category: "Văn học"
    },
    {
        id: 4,
        title: "Xu hướng xuất bản sách mới nhất",
        excerpt: "Cập nhật những xu hướng mới nhất trong ngành xuất bản và các thể loại sách đang được ưa chuộng.",
        image: news4,
        date: "March 9, 2026",
        category: "Tin tức"
    }
]

const Blog = () => {
    return (
        <div className="py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Blog</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Khám phá những bài viết thú vị về sách, tác giả và thế giới văn học
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                    <article key={post.id} className="bg-white rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden group">
                        <div className="relative h-64 overflow-hidden">
                            <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-secondary text-white px-4 py-2 rounded-full text-sm font-semibold">
                                    {post.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-sm text-gray-500 mb-3">{post.date}</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-secondary transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {post.excerpt}
                            </p>
                            <Link 
                                to="/shop"
                                className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all duration-300"
                            >
                                <span>Đọc thêm</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}

export default Blog
