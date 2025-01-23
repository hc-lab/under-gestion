import {
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    CubeIcon,
    ChartBarIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/solid';

// Exportaciones individuales
export const BoxIcon = CubeIcon;
export const StockIcon = ChartBarIcon;
export const AlertIcon = ExclamationCircleIcon;
export const SearchIcon = MagnifyingGlassIcon;
export const FilterIcon = FunnelIcon;

// Exportación por defecto del objeto icons
const icons = {
    plus: PlusIcon,
    search: SearchIcon,
    filter: FilterIcon,
    box: BoxIcon,
    stock: StockIcon,
    alert: AlertIcon
};

export default icons; 