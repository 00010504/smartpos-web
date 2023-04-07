let cbRef;

const keypress = {
  register: (callback) => {
    if (typeof callback === "function") {
      cbRef = callback;
      window.addEventListener("keypress", callback);
    }
  },
  unregister: () => {
    window.removeEventListener("keypress", cbRef);
  },
};

export default keypress;
