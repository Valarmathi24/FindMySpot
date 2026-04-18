import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Loading() {

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 2500);
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white">

      <h1 className="text-4xl font-bold text-green-400 mb-4">
        Find My Spot
      </h1>

      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>

      <p className="mt-4 text-gray-400">
        Smart Parking System
      </p>

    </div>
  );
}

export default Loading;