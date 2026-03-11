import React, { useState } from 'react'
import InputField from './InputField'
import SelectField from './SelectField'
import { useForm } from 'react-hook-form';
import { useAddBookMutation } from '../../../redux/features/books/booksApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiBook, FiDollarSign, FiImage, FiPackage } from 'react-icons/fi';
import { CATEGORIES } from '../../../utils/categories.jsx';

const AddBook = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const [imageFile, setimageFile] = useState(null);
    const [addBook, {isLoading, isError}] = useAddBookMutation()
    const [imageFileName, setimageFileName] = useState('')
    const onSubmit = async (data) => {
        if (!imageFileName) {
            alert("Please select a cover image");
            return;
        }
        
        // Kiểm tra giá bán không được cao hơn giá cũ
        if (Number(data.newPrice) > Number(data.oldPrice)) {
            Swal.fire({
                title: "Lỗi giá bán",
                text: "Giá bán không được cao hơn giá cũ!",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK"
            });
            return;
        }
        
        const newBookData = {
            title: data.title,
            description: data.description,
            category: data.category,
            author: data.author || 'Đang cập nhật',
            publisher: data.publisher || 'Đang cập nhật',
            publishedDate: data.publishedDate || null,
            status: data.status || null,
            oldPrice: Number(data.oldPrice),
            newPrice: Number(data.newPrice),
            coverImage: imageFileName,
            stock: Number(data.stock) || 0,
            rewardPoints: Number(data.rewardPoints) || 0
        }
        try {
            await addBook(newBookData).unwrap();
            Swal.fire({
                title: "Book added",
                text: "Your book is uploaded successfully!",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, It's Okay!"
              });
              reset();
              setimageFileName('')
              setimageFile(null);
              navigate('/dashboard/manage-books');
        } catch (error) {
            console.error("Error adding book:", error);
            const errorMessage = error?.data?.message || error?.message || "Failed to add book. Please try again.";
            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK"
            });
        }
      
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setimageFile(file);
            setimageFileName(file.name);
        }
    }
  return (
    <div className="max-w-4xl mx-auto md:p-6 p-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <FiBook className="w-8 h-8" />
          Thêm sách mới
        </h2>
        <p className="text-purple-100 mt-2">Điền thông tin đầy đủ để thêm sách vào hệ thống</p>
      </div>

      {/* Form starts here */}
      <form onSubmit={handleSubmit(onSubmit)} className='bg-white rounded-xl shadow-lg p-6'>
        {/* Thông tin cơ bản */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-purple-200">
            <FiBook className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">Thông tin cơ bản</h3>
          </div>
          
          <div className="space-y-4">
            <InputField
              label="Tên sách *"
              name="title"
              placeholder="Nhập tên sách"
              register={register}
              required={true}
            />

            <InputField
              label="Mô tả *"
              name="description"
              placeholder="Nhập mô tả về sách"
              type="textarea"
              register={register}
              required={true}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Tác giả"
                name="author"
                placeholder="Tên tác giả (mặc định: Đang cập nhật)"
                register={register}
              />

              <InputField
                label="Nhà xuất bản"
                name="publisher"
                placeholder="Tên nhà xuất bản"
                register={register}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField
                label="Danh mục *"
                name="category"
                options={[
                  { value: '', label: 'Chọn danh mục' },
                  ...CATEGORIES
                ]}
                register={register}
                required={true}
              />

              <SelectField
                label="Trạng thái"
                name="status"
                options={[
                  { value: '', label: 'Không có' },
                  { value: 'flash-sale', label: '⚡ Flash Sale' },
                ]}
                register={register}
              />

              <InputField
                label="Ngày phát hành"
                name="publishedDate"
                type="date"
                register={register}
              />
            </div>
          </div>
        </div>

        {/* Giá cả và kho hàng */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-green-200">
            <FiDollarSign className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">Giá cả và kho hàng</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Giá cũ (₫) *"
              name="oldPrice"
              type="number"
              placeholder="Nhập giá cũ"
              register={register}
              required={true}
            />

            <InputField
              label="Giá bán (₫) *"
              name="newPrice"
              type="number"
              placeholder="Nhập giá bán"
              register={register}
              required={true}
            />

            <InputField
              label="Số lượng kho *"
              name="stock"
              type="number"
              placeholder="Nhập số lượng"
              register={register}
              required={true}
            />

            <InputField
              label="Điểm thưởng"
              name="rewardPoints"
              type="number"
              placeholder="Điểm thưởng khi mua (mặc định: 0)"
              register={register}
            />
          </div>
        </div>

        {/* Hình ảnh */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-blue-200">
            <FiImage className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Hình ảnh</h3>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-500 transition-colors">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Ảnh bìa sách *</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />
            {imageFileName && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <FiPackage className="text-green-600" />
                <p className="text-sm text-green-700 font-medium">Đã chọn: {imageFileName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Đang thêm...</span>
            </>
          ) : (
            <>
              <FiPackage className="w-5 h-5" />
              <span>Thêm sách</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default AddBook