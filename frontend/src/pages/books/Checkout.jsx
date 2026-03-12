import React,{useState} from 'react'
import Loading from '../../components/Loading';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../redux/features/cart/cartSlide';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatVND } from '../../utils/formatVND';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
import { useTierNotification } from '../../context/TierNotificationContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import getBaseUrl from '../../utils/baseURL';


const Checkout = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const totalPrice = parseFloat(cartItems.reduce((acc, item) => acc + (item.newPrice * (item.quantity || 1)), 0).toFixed(2));
    const { currentUser } = useAuth();
    const { showTierUpgrade } = useTierNotification();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();
    const navigate = useNavigate();

    const [isChecked, setIsChecked] = useState(false);

    const onSubmit = async (data) => {
        
        const newOrder = {
            name: data.name,
            email: currentUser?.email,
            address:{
                street: data.address,
                city: data.city,
                state: data.state,
                country: data.country,
                zipcode: data.zipcode,
            },
            phone: data.phone,
            productIds: cartItems.map(item => item?._id),
            quantities: cartItems.map(item => item.quantity || 1),
            totalPrice: totalPrice,
        }
        
        try {
            await createOrder(newOrder).unwrap();
            
            // Calculate points based on order total
            // TODO: Customize point calculation (currently 1 point per 10,000 VND or 1 point per $1)
            const pointsToAdd = Math.floor(Number(totalPrice));
            
            // Add points to user profile
            if (currentUser?.email && pointsToAdd > 0) {
                try {
                    const response = await axios.put(
                        `${getBaseUrl()}/api/users/${currentUser.email}/points`,
                        { points: pointsToAdd }
                    );
                    
                    // Check if tier was upgraded
                    if (response.data.tierUpgraded) {
                        // Show tier upgrade notification
                        setTimeout(() => {
                            showTierUpgrade(response.data.tier);
                        }, 1000);
                        
                        Swal.fire({
                            title: "Đơn hàng đã được xác nhận!",
                            html: `
                                <p>Đơn hàng của bạn đã được đặt thành công!</p>
                                <p class="mt-2 text-green-600 font-bold">+${pointsToAdd} điểm thưởng</p>
                                <p class="mt-2 text-purple-600">🎉 Chúc mừng! Bạn đã lên hạng ${response.data.tier === 'silver' ? 'Bạc' : response.data.tier === 'gold' ? 'Vàng' : 'Kim Cương'}!</p>
                            `,
                            icon: "success",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "Xem đơn hàng"
                        });
                    } else {
                        Swal.fire({
                            title: "Đơn hàng đã được xác nhận!",
                            html: `
                                <p>Đơn hàng của bạn đã được đặt thành công!</p>
                                <p class="mt-2 text-green-600 font-bold">+${pointsToAdd} điểm thưởng</p>
                            `,
                            icon: "success",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "Xem đơn hàng"
                        });
                    }
                } catch (pointsError) {
                    console.error('Error adding points:', pointsError);
                    // Still show success for order even if points fail
                    Swal.fire({
                        title: "Đơn hàng đã được xác nhận!",
                        text: "Đơn hàng của bạn đã được đặt thành công!",
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Xem đơn hàng"
                    });
                }
            } else {
                Swal.fire({
                    title: "Đơn hàng đã được xác nhận!",
                    text: "Đơn hàng của bạn đã được đặt thành công!",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Xem đơn hàng"
                });
            }
            
            dispatch(clearCart());
            navigate('/user/dashboard/orders');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Error creating order. Please try again.');
        }
        
    }
    if (isLoading) return <Loading />;
  return (
    <section>
        <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
    <div className="container max-w-screen-lg mx-auto">
        <div>
            <div>
            <h2 className="font-semibold text-xl text-gray-600 mb-2">Cash On Delevary</h2>
            <p className="text-gray-500 mb-2">Total Price: {formatVND(totalPrice)}</p>
            <p className="text-gray-500 mb-6">Items:{cartItems.length > 0 ? cartItems.length : 0}</p>
            </div>

            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8">
                        <div className="text-gray-600">
                            <p className="font-medium text-lg">Personal Details</p>
                            <p>Please fill out all the fields.</p>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                <div className="md:col-span-5">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        {...register("name", { required: true })}
                                        type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"  />
                                </div>

                                <div className="md:col-span-5">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        {...register("email")}
                                        type="email" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" 
                                        disabled
                                        defaultValue={currentUser?.email}
                                        placeholder="email@domain.com" />
                                </div>
                                <div className="md:col-span-5">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        {...register("phone", { required: true })}
                                        type="tel" name="phone" id="phone" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="+123 456 7890" />
                                </div>

                                <div className="md:col-span-3">
                                    <label htmlFor="address">Address / Street</label>
                                    <input
                                        {...register("address", { required: true })}
                                        type="text" name="address" id="address" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="city">City</label>
                                    <input
                                        {...register("city", { required: true })}
                                        type="text" name="city" id="city" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="country">Country / region</label>
                                    <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                                        <input
                                            {...register("country", { required: true })}
                                            name="country" id="country" placeholder="Country" className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                                        <button tabIndex="-1" className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600">
                                            <svg className="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                        <button tabIndex="-1" className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-blue-600">
                                            <svg className="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="state">State / province</label>
                                    <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                                        <input 
                                            {...register("state", { required: true })}
                                            name="state" id="state" placeholder="State" className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"  />
                                        <button  className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600">
                                            <svg className="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                        <button tabIndex="-1" className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-blue-600">
                                            <svg className="w-4 h-4 mx-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="md:col-span-1">
                                    <label htmlFor="zipcode">Zipcode</label>
                                    <input 
                                        {...register("zipcode", { required: true })}
                                        type="text" name="zipcode" id="zipcode" className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="" />
                                </div>

                                <div className="md:col-span-5 mt-3">
                                    <div className="inline-flex items-center">
                                        <input 
                                            onChange={(e) => setIsChecked(e.target.checked)}
                                            type="checkbox" name="billing_same" id="billing_same" className="form-checkbox" />
                                        <label htmlFor="billing_same" className="ml-2 ">I am aggree to the <Link className='underline underline-offset-2 text-blue-600'>Terms & Conditions</Link> and <Link  className='underline underline-offset-2 text-blue-600'>Shoping Policy.</Link></label>
                                    </div>
                                </div>



                                <div className="md:col-span-5 text-right">
                                    <div className="inline-flex items-end">
                                        <button 
                                        disabled={!isChecked}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Place an Order</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            

           
        </div>

        
    </div>
</div>
    </section>
  )
}

export default Checkout
