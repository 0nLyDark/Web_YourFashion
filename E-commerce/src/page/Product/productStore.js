import { apiURL } from "../../api/apiConfig";
import { Link } from "react-router-dom";
function ProductStore(props) {
  return (
    <div className="row">
      <div className="col-md-5 row">
        <div className="col-3">
          <div className="logo-shop">
            <img
              src={`${apiURL}stores/image/${props.store.logo}`}
              alt={props.store.logo}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
        <div className="col-9">
          <div className="fs-4 mb-2">{props.store.storeName}</div>
          <div>
            <Link className="btn-shop me-3 py-1 px-2"> Theo dõi</Link>
            <Link
              className="btn-shop me-3 py-1 px-2"
              to={`/Shop/${props.store.id}`}
            >
              <i class="fa-thin fa-store"></i> Xem Shop
            </Link>
          </div>
        </div>
      </div>
      <div className="col-md-7"></div>
    </div>
  );
}

export default ProductStore;
