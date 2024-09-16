import { Link } from "react-router-dom";

function MenuItem(props) {
  return (
    <>
      {props.category &&
        (props.category.categoryChildren.length === 0 ? (
          <li>
            <Link
              class=" menu-link"
              to={`/ListingGrid?categoryId=${props.category.categoryId}`}
            >
              <span style={{ fontSize: "14px" }}>{props.category.categoryName}</span>
            </Link>
          </li>
        ) : (
          <li class="menu-item  menu-end dropend">
            <Link
              class="menu-link "
              to={`/ListingGrid?categoryId=${props.category.categoryId}`}
            >
              <span style={{ fontSize: "14px" }}>
                {props.category.categoryName}
              </span>
              <i class="fa-light fa-chevron-right"></i>
            </Link>

            <ul class="dropdown-menu">
              {props.category.categoryChildren.map((row) => (
                <MenuItem category={row} />
              ))}
            </ul>
          </li>
        ))}
    </>
  );
}

export default MenuItem;
