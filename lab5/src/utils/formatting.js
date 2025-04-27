export const formatBytes = (bytes, decimals = 2) => {
    if (typeof bytes !== 'number' || isNaN(bytes) || bytes <= 0) {
      return bytes === 0 ? '0 Bytes' : 'N/A';
    }
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const index = Math.min(i, sizes.length - 1);
    const formattedValue = parseFloat((bytes / Math.pow(k, index)).toFixed(dm));
  
    return `${formattedValue} ${sizes[index]}`;
  };
  
  export const formatDate = (timestamp) => {
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
        return timestamp === null || timestamp === undefined ? 'N/A' : 'Invalid Date';
    }
  
    try {
      const date = new Date(timestamp * 1000);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString();
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid Date';
    }
  };