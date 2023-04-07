let cbRef;

const online = {
  register: (callback) => {
    if (typeof callback === "function") {
      cbRef = callback;
      window.addEventListener("online", cbRef);
    }
  },
  unregister: () => {
    window.removeEventListener("online", cbRef);
  },
};

export default online;
