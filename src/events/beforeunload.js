let cbRef;

const beforeunload = {
  register: (callback) => {
    if (typeof callback === "function") {
      cbRef = callback;
      window.addEventListener("beforeunload", cbRef);
    }
  },
  unregister: () => {
    window.removeEventListener("beforeunload", cbRef);
  },
};

export default beforeunload;
