import { apiURL } from "../../api/apiConfig";
import { Link } from "react-router-dom";
function ProductStore(props) {
  return (
    <div className="p-4 bg-info" style={{ borderRadius: "25px" }}>
      <div className="border-info-shop" style={{ maxWidth: "350px" }}>
        <div>
          <div className="logo-shop">
            <img
              src={`${apiURL}stores/image/${props.store.logo}`}
              alt={props.store.logo}
            />
          </div>
        </div>
        <div className="info-shop">
          <div className="">
            <div className="mb-3">
              <strong style={{ fontSize: "16px" }}>
                {props.store.storeName}
              </strong>
            </div>
            <div>
              <Link
                className="btn-shop  py-2 px-2"
                style={{ margin: "0px 15px 0px 0px" }}
              >
                {" "}
                Theo dõi
              </Link>
              <Link
                className="btn-shop  py-2 px-2"
                style={{ margin: "0px" }}
                to={`/Shop/${props.store.id}`}
              >
                <i class="fa-thin fa-store"></i> Xem Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductStore;
