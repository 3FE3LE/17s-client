import type { AssetRecipe } from '../domain/recipe';
import { AssetRecipeSchema } from '../domain/recipe';

/**
 * Serialize a recipe to a stable, pretty JSON string. Object key order follows
 * the literal below so re-exporting an unchanged recipe is byte-stable.
 */
export function serializeRecipe(recipe: AssetRecipe): string {
  const validated = AssetRecipeSchema.parse(recipe);
  return JSON.stringify(validated, null, 2);
}

/** Parse + validate a recipe JSON string. Throws (ZodError) on invalid input. */
export function parseRecipe(json: string): AssetRecipe {
  const raw: unknown = JSON.parse(json);
  return AssetRecipeSchema.parse(raw);
}

/** Validate an already-parsed value as a recipe. */
export function validateRecipe(input: unknown): AssetRecipe {
  return AssetRecipeSchema.parse(input);
}
