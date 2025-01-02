import getBillboards from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";

import Container from "@/components/ui/container";
import Billboard from "@/components/store/billboard";
import ProductList from "@/components/store/product-list";

export const revalidate = 0;

const HomePage = async () => {
  const billboard = await getBillboards("f95354c4-c861-44fb-a52c-f8f57725b622");
  const products = await getProducts({ isFeatured: true });

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard data={billboard} />
        <div className="flex flex-col gap-y-8 px-4 lg:px-8">
          <ProductList title="Featured Products" items={products} />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;