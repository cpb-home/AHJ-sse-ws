const createRequest = async (options) => {
  fetch('https://socket-server-3il3.onrender.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(options)
  })
};

export default createRequest;
