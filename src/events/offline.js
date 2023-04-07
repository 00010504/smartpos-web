let cbRef;

const offline = {
  register: (callback) => {
    if (typeof callback === "function") {
      cbRef = callback;
      window.addEventListener("offline", cbRef);
    }
  },
  unregister: () => {
    window.removeEventListener("offline", cbRef);
  },
};

export default offline;
