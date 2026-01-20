export interface Brand {
  id: string;
  name: string;
}

export interface Weight {
  value: number;
  unit: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  brand: Brand;
  weight: Weight;
  images: { image: string }[];
  tags: { name: string }[];
  isHotDeal: boolean;
  isPopular: boolean;
}