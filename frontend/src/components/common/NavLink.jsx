const NavLink = ({ children }) => {
  return (
    <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">
      {children}
    </a>
  );
};

export default NavLink; 