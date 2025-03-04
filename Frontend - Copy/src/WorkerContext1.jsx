import React, { createContext, useState, useEffect, useContext } from "react";
import { getAllWorkerDetailsAPI } from "./services/Allapi";

const WorkerContext = createContext();

export const WorkerProvider = ({ children }) => {
  const [pendingWorkers, setPendingWorkers] = useState(0);

  const fetchPendingWorkers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await getAllWorkerDetailsAPI(headers);

      if (Array.isArray(response.data)) {
        setPendingWorkers(response.data.length);
      } else {
        setPendingWorkers(0);
      }
    } catch (error) {
      console.error("Error fetching worker details:", error);
      setPendingWorkers(0);
    }
  };

  return (
    <WorkerContext.Provider value={{ pendingWorkers, fetchPendingWorkers }}>
      {children}
    </WorkerContext.Provider>
  );
};

// Create a custom hook for easier context access
export const useWorkerContext = () => {
  return useContext(WorkerContext);
};
