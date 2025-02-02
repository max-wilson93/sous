// Resolve conflicts when syncing data between peers
export const resolveConflict = (currentData, incomingData) => {
    // Simple conflict resolution: prefer the latest update
    return incomingData.timestamp > currentData.timestamp ? incomingData : currentData;
  };