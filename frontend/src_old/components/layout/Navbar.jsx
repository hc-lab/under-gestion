const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
          </div>
          
          {/* Menú principal */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink>Dashboard</NavLink>
              <NavLink>Inventario</NavLink>
              <NavLink>Reportes</NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 