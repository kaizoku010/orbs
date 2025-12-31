// Category Service - Simulates categories API
import { realisticDelay } from '../delays';
import { getCategories, getCategoryById, type Category } from '../store';

export interface CategoryResponse {
  success: boolean;
  category?: Category;
  error?: string;
}

export interface CategoriesResponse {
  success: boolean;
  categories?: Category[];
  error?: string;
}

export async function fetchAllCategories(): Promise<CategoriesResponse> {
  await realisticDelay();
  return { success: true, categories: getCategories() };
}

export async function fetchCategoryById(id: string): Promise<CategoryResponse> {
  await realisticDelay();
  const category = getCategoryById(id);
  if (category) {
    return { success: true, category };
  }
  return { success: false, error: 'Category not found' };
}

export async function fetchDeliverableCategories(): Promise<CategoriesResponse> {
  await realisticDelay();
  const categories = getCategories().filter(c => c.deliverable);
  return { success: true, categories };
}

export async function searchCategories(query: string): Promise<CategoriesResponse> {
  await realisticDelay();
  const lowerQuery = query.toLowerCase();
  const categories = getCategories().filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery) ||
    c.subcategories.some(s => s.toLowerCase().includes(lowerQuery))
  );
  return { success: true, categories };
}

