
import { NewsCard } from "./NewsCard";
import { motion } from 'framer-motion';

interface Article {
  url: string;
  title: string;
  description: string;
  urlToImage: string;
  source: {
    name: string;
  };
}

interface NewsGridProps {
  articles: Article[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {articles?.map((article: any, index: any) => (
        <motion.div
          key={article.url}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <NewsCard
            title={article.title}
            summary={article.description}
            image={article.urlToImage}
            source={article.source?.name}
            url={article.url}
          />
        </motion.div>
      ))}
    </div>
  );
}