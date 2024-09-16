import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div
      style={{ height: "500px" }}
      className="d-flex justify-content-center align-items-center"
    >
        <h2> 404 Not Found</h2>

        <Link to="/" className="btn btn-secondary ms-4">
          Quay lại trang chủ
        </Link>
    </div>
  );
}
