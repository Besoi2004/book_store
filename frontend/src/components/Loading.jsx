import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div 
          className="rounded-full h-16 w-16 border-4 border-gray-200"
          style={{
            borderTopColor: '#FFCE1A',
            animation: 'spin 1s linear infinite'
          }}
        ></div>
        {/* Loading text */}
        <p className="text-gray-600 font-medium">Đang tải...</p>
      </div>
      
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;