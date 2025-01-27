

export const fetchTopHeadlines = async (category: string = 'general', page: number = 1) => {
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&apiKey=${process.env.NEWS_API_KEY}`
  );
  const data = await response.json();
  const filteredArticles = data.articles.filter((article: { url: string; urlToImage: string }) => 
    article.url && 
    article.urlToImage &&
    article.url.trim() !== '' &&
    article.urlToImage.trim() !== ''
  );
  
  return {
    ...data,
    articles: filteredArticles
  };
}
