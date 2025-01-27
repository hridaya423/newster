export const fetchTopHeadlines = async (category: string = 'general', page: number = 1) => {
  const response = await fetch(
    `/api/news?category=${category}&page=${page}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  return response.json();
};