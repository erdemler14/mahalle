/**
 * Runtime and testable integrity checks for business product catalogs.
 * A product is valid only when its recipe is non-empty and every ingredient
 * exists in that business' own procurement profile with a positive quantity.
 */
export function validateBusinessCatalog({
  properties = [],
  catalog = {},
  getProfile = () => null,
  getRecipe = () => [],
  exemptPropertyIds = []
} = {}) {
  const propertyById = new Map(properties.map(property => [Number(property.id), property]));
  const exempt = new Set(exemptPropertyIds.map(Number));
  const issues = [];

  for (const [rawId, products] of Object.entries(catalog)) {
    const propertyId = Number(rawId);
    if (!Array.isArray(products) || !products.length) continue;
    const property = propertyById.get(propertyId);
    const profile = getProfile(propertyId);
    const materials = Array.isArray(profile?.materials) ? profile.materials : [];
    const materialIds = new Set(materials.map(material => material.id));
    const seen = new Set();

    if (!property) {
      issues.push({ code: 'unknown-business', propertyId, message: 'Katalogda karşılığı olmayan işletme kimliği: ' + propertyId });
      continue;
    }

    for (const product of products) {
      if (!product || !product.id || !(Number(product.price) > 0)) continue;
      if (seen.has(product.id)) {
        issues.push({ code: 'duplicate-product-id', propertyId, productId: product.id, message: property.name + ': yinelenen ürün kimliği ' + product.id });
      }
      seen.add(product.id);

      if (exempt.has(propertyId) || materials.length === 0) continue;
      let recipe = [];
      try { recipe = getRecipe(propertyId, product) || []; }
      catch (error) {
        issues.push({ code: 'recipe-error', propertyId, productId: product.id, message: property.name + ' / ' + product.name + ': reçete okunamadı (' + error.message + ')' });
        continue;
      }
      if (!Array.isArray(recipe) || recipe.length === 0) {
        issues.push({ code: 'missing-recipe', propertyId, productId: product.id, message: property.name + ' / ' + product.name + ': üretim veya hizmet reçetesi tanımlanmamış' });
        continue;
      }
      for (const ingredient of recipe) {
        if (!ingredient?.id || !materialIds.has(ingredient.id)) {
          issues.push({ code: 'unknown-material', propertyId, productId: product.id, materialId: ingredient?.id, message: property.name + ' / ' + product.name + ': işletmenin tedarik profilinde bulunmayan hammadde ' + (ingredient?.id || '(boş)') });
        } else if (!Number.isFinite(Number(ingredient.qty)) || Number(ingredient.qty) <= 0) {
          issues.push({ code: 'invalid-quantity', propertyId, productId: product.id, materialId: ingredient.id, message: property.name + ' / ' + product.name + ': geçersiz hammadde miktarı' });
        }
      }
    }
  }
  return issues;
}
