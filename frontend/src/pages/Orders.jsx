import React, { useContext, useEffect } from 'react';
import { FaBoxOpen, FaCheckCircle, FaTimesCircle, FaTruck } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import Badge from '../components/ui/Badge';
import { formatPrice } from '../utils/formatPrice';
import useScrollTop from '../hooks/useScrollTop';

const Orders = () => {
  useScrollTop();
  const { orders, loadingOrders, fetchMyOrders, userInfo } = useContext(ShopContext);

  useEffect(() => {
    if (userInfo) {
      fetchMyOrders();
    }
  }, [userInfo]); // eslint-disable-next-line react-hooks/exhaustive-deps

  if (loadingOrders) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 min-h-screen">
        <LoadingSkeleton type="list" count={3} />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 md:py-20 min-h-screen">
        <EmptyState 
          icon={FaBoxOpen}
          title="No orders found"
          description="You haven't placed any orders yet. Start exploring our premium collection."
          actionText="Start Shopping"
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 lg:py-12 bg-amazon-grayBg dark:bg-slate-950 transition-colors min-h-screen">
      
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shadow-inner">
            <FaBoxOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Order History</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm animate-fadeInUp">
            
            {/* Order Header */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Order Placed</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{formatPrice(order.totalPrice)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Order #</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Badge variant={order.isPaid ? 'success' : 'danger'} className="flex items-center gap-1.5 justify-center">
                  {order.isPaid ? <FaCheckCircle /> : <FaTimesCircle />} 
                  {order.isPaid ? 'Paid' : 'Payment Pending'}
                </Badge>
                <Badge variant={order.isDelivered ? 'success' : 'warning'} className="flex items-center gap-1.5 justify-center">
                  {order.isDelivered ? <FaCheckCircle /> : <FaTruck />} 
                  {order.isDelivered ? 'Delivered' : 'In Transit'}
                </Badge>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-2 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-bold text-slate-900 dark:text-white line-clamp-2">{item.name}</h4>
                      <div className="mt-1 flex items-center gap-4 text-sm">
                        <span className="text-slate-500 font-medium">Qty: {item.qty}</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Orders;
