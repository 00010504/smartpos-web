let cbRef;

const keydown = {
  register: (callback) => {
    if (typeof callback === "function") {
      cbRef = callback;
      window.addEventListener("keydown", callback);
    }
  },
  unregister: () => {
    window.removeEventListener("keydown", cbRef);
  },
};

export default keydown;
