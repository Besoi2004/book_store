import React, { useEffect } from 'react'
import InputField from '../addBooks/InputField'
import SelectField from '../addBooks/SelectField'
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchBookByIdQuery, useUpdateBookMutation } from '../../../redux/features/books/booksApi';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';
import { FiBook, FiDollarSign, FiImage, FiEdit3 } from 'react-icons/fi';
import { CATEGORIES } from '../../../utils/categories.jsx';

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: bookData, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const { register, handleSubmit, setValue, reset } = useForm();
  useEffect(() => {
    if (bookData) {
      setValue('title', bookData.title);
      setValue('description', bookData.description);
      setValue('category', bookData?.category);
      setValue('author', bookData.author || '');
      setValue('publisher', bookData.publisher || '');
      setValue('publishedDate', bookData.publishedDate ? new Date(bookData.publishedDate).toISOString().split('T')[0] : '');
      setValue('status', bookData.status || '');
      setValue('oldPrice', bookData.oldPrice);
      setValue('newPrice', bookData.newPrice);
      setValue('coverImage', bookData.coverImage);
      setValue('stock', bookData.stock || 0);
      setValue('rewardPoints', bookData.rewardPoints || 0);
    }
  }, [bookData, setValue])

  const onSubmit = async (data) => {
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
    
    const updateBookData = {
      title: data.title,
      description: data.description,
      category: data.category,
      author: data.author || 'Đang cập nhật',
      publisher: data.publisher || 'Đang cập nhật',
      publishedDate: data.publishedDate || null,
      status: data.status || null,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      coverImage: data.coverImage || bookData.coverImage,
      stock: Number(data.stock) || 0,
      rewardPoints: Number(data.rewardPoints) || 0
    };
    
    try {
      await updateBook({ id, ...updateBookData }).unwrap();
      Swal.fire({
        title: "Book Updated",
        text: "Your book is updated successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!"
      });
      navigate('/dashboard/manage-books');
    } catch (error) {
      console.error("Failed to update book:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update book. Please try again.";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK"
      });
    }
  }
  if (isLoading) return <Loading />
  if (isError) return <div>Error fetching book data</div>
  return (
    <div className="max-w-4xl mx-auto md:p-6 p-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <FiEdit3 className="w-8 h-8" />
          Cập nhật thông tin sách
        </h2>
        <p className="text-blue-100 mt-2">Chỉnh sửa thông tin sách: {bookData?.title}</p>
      </div>

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
                placeholder="Tên tác giả"
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
              placeholder="Giá cũ"
              register={register}
              required={true}
            />

            <InputField
              label="Giá bán (₫) *"
              name="newPrice"
              type="number"
              placeholder="Giá bán"
              register={register}
              required={true}
            />

            <InputField
              label="Số lượng kho *"
              name="stock"
              type="number"
              placeholder="Số lượng trong kho"
              register={register}
              required={true}
            />

            <InputField
              label="Điểm thưởng"
              name="rewardPoints"
              type="number"
              placeholder="Điểm thưởng khi mua"
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
          
          <InputField
            label="URL Ảnh bìa *"
            name="coverImage"
            type="text"
            placeholder="Nhập URL ảnh bìa hoặc tên file"
            register={register}
            required={true}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isUpdating}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Đang cập nhật...</span>
            </>
          ) : (
            <>
              <FiEdit3 className="w-5 h-5" />
              <span>Cập nhật thông tin</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default UpdateBook