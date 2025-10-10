export default function CategoryBar({ categories = [], active = "", onSelect }) {
  return (
    <div id="cats" className="categories">
      <button
        className={!active ? "cat active" : "cat"}
        onClick={() => onSelect("")}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={active === cat ? "cat active" : "cat"}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
