import commonAPI from "./commonAPI";
import SERVER_URL from './serverURL'

export const registerAPI=async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/register`,reqBody)
}

export const loginAPI=async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/login`,reqBody)
}

//add worker details
export const addWorkerAPI = async (reqBody, reqHeader) => {
    return await commonAPI("POST", `${SERVER_URL}/uploads`, reqBody, reqHeader);
  };

//get all woroker details
export const getAllWorkerDetailsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/pending-workers`, {}, reqHeader);
};

// approve worker 
export const approveWorkerAPI = async (workerId, reqHeader) => {
    return await commonAPI("PUT", `${SERVER_URL}/verify-worker/${workerId}`, {}, reqHeader);
};


//get Verified and Available Worker Details for user pannel
export const getVerifiedAvailableWorkerDetailsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/available-verified`, {}, reqHeader);
};

// Upload a booking | that send to the corresponding worker
export const addBookingAPI = async (complaintData, reqHeader) => {
    return await commonAPI("POST",`${SERVER_URL}/bookings`, complaintData,reqHeader );
};

// Get booking by ID || when user try to request to the worker ,and id is passed inside of the header
export const getBookingByIdAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/worker-bookings`,{}, reqHeader);
  };

// update Worke status pending - rejected/accepted by worker
export const updateWorkeStatusByWorkerAPI = async (reqHeader,reqBody,bookingId) => {
    return await commonAPI("PUT", `${SERVER_URL}/bookings/${bookingId}`,reqBody, reqHeader);
  };

// update Worke status pending - rejected/accepted by worker
export const deleteBookingWhenWorkerRejectAPI = async (reqHeader,bookingId) => {
     return await commonAPI("DELETE", `${SERVER_URL}/bookings-delete/${bookingId}`,{}, reqHeader);
  };

  // Get booking by ID 
export const getUserBookingByIdAPI = async (reqHeader) => { 
    return await commonAPI("GET", `${SERVER_URL}/user-bookings`,{}, reqHeader);
  };


//gets all verified worker for admin pannel
  export const getVerifiedWorkerAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/verified-workers`,{}, reqHeader);
  };

//block worker by admin
  export const blockWorkerAPI = async (reqHeader,workerId) => {
    return await commonAPI("PUT", `${SERVER_URL}/block-worker/${workerId}`,{}, reqHeader);
  };

  // Unblock  worker by admin
  export const unblockWorkerAPI = async (reqHeader, workerId) => {
    return await commonAPI("PUT", `${SERVER_URL}/unblock-worker/${workerId}`, {}, reqHeader);
  };


  //get all the users
  export const getAllUsersAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/get-users`,{}, reqHeader);
  };

  

  //block user by admin
  export const blockUserAPI = async (reqHeader,userId) => {
    return await commonAPI("PUT", `${SERVER_URL}/block-user/${userId}`,{}, reqHeader);
  };

  // Unblock a user by admin
  export const unblockUserAPI = async (reqHeader, userId) => {
    return await commonAPI("PUT", `${SERVER_URL}/unblock-user/${userId}`, {}, reqHeader);
  };

  // toggle worker availability
   export const toggleWorkerAvailabilityAPI = async (reqHeader,WorkerId,reqBody) => {
    return await commonAPI("PUT", `${SERVER_URL}/toggle-availability/${WorkerId}`,reqBody, reqHeader);
  };

  //get worker details for checking is he verified 
  export const getLoginWorkerAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/worker-details`,{}, reqHeader);
  };

  
