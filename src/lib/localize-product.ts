import type { IProduct } from "@/types";
import type { Locale } from "@/context/LocaleContext";

export function localizeProduct(product: IProduct, locale: Locale): IProduct {
  if (locale === "es") return product;
  return {
    ...product,
    description: product.description_en || product.description,
    story: product.story_en || product.story,
    inspiration: product.inspiration_en || product.inspiration,
    materials: product.materials_en || product.materials,
    edition: product.edition_en || product.edition,
    creationTime: product.creationTime_en || product.creationTime,
    uniqueTraits:
      product.uniqueTraits_en.length > 0
        ? product.uniqueTraits_en
        : product.uniqueTraits,
    category:
      typeof product.category === "object" && product.category !== null
        ? {
            ...product.category,
            name: product.category.name_en || product.category.name,
          }
        : product.category,
  };
}
