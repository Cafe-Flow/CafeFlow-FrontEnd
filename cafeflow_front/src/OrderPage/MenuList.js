import { CiShoppingBasket } from "react-icons/ci";

function MenuList({ items, onAddToCart }) {
  return (
    <div className="menu-list">
      {items.map((item) => (
        <div
          key={item.name}
          className="menu-item"
          onClick={() => onAddToCart(item)}
        >
          <img src={item.image} alt={item.name} />
          <div className="menu-item-bar">
            <p>{item.name}</p>
            <CiShoppingBasket />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuList;
