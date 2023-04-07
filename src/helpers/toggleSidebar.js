export default function toggleSidebar(cb) {
  return (e) => {
    if (e.key === "b" && e.ctrlKey) {
      cb();
    }
  };
}
