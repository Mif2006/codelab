const sections = ["Home", "Projects", "Gallery", "About", "Contact"];

interface NavigationDotsProps {
  activeIndex: number;
  onNavigate: (index: number) => void;
}

const NavigationDots = ({ activeIndex, onNavigate }: NavigationDotsProps) => {
  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
      {sections.map((name, i) => (
        <button
          key={i}
          onClick={() => onNavigate(i)}
          data-cursor-hover
          className="group relative flex items-center"
        >
          <span className="absolute right-6 font-body text-[10px] tracking-[0.2em] uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {name}
          </span>
          <div className={`nav-dot ${activeIndex === i ? "active" : ""}`} />
        </button>
      ))}
    </nav>
  );
};

export default NavigationDots;
