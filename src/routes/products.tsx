import { createFileRoute, Outlet } from "@tanstack/react-router";

// Parent layout route for /products, /products/ (index), and /products/$productId.
// Sets dark background for all product pages.
export const Route = createFileRoute("/products")({
  component: ProductsLayout,
});

function ProductsLayout() {
  return (
    <div className="bg-white min-h-screen text-[#163458]">
      <Outlet />
    </div>
  );
}
