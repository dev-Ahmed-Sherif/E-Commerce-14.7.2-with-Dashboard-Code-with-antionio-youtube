import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";

import Gallery from "@/components/store/index";
import Info from "@/components/store/info";
import ProductList from "@/components/store/product-list";

import Container from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";

type ProductPageProps = {
  params: {
    productId: string;
  };
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const product = await getProduct(params.productId);

  const suggestedProducts = await getProducts({
    categoryId: product.category.id,
  });

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={product.images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              {/* Info */}
              <Info data={product} />
            </div>
          </div>
          <Separator className="my-8" />
          {/* Suggested Products */}
          <ProductList title="Related items" items={suggestedProducts} />
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
