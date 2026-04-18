import React, { Component } from 'react'

export class Landing extends Component {
  render() {
    return(

    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-4xl font-bold text-center">
        Smart Parking System
      </h1>

      <p className="text-gray-400 mt-4 text-center max-w-lg">
        Find available parking spaces instantly using AI powered detection.
        Reduce traffic congestion and park faster.
      </p>

      <div className="mt-8 flex gap-6 flex-wrap justify-center">

        <button
          onClick={()=>navigate("/login/user")}
          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          User Login
        </button>

        <button
          onClick={()=>navigate("/login/admin")}
          className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Admin Login
        </button>

      </div>

    </div>

  )
  }
}

export default Landing