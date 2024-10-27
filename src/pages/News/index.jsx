import React, { useState, useEffect } from 'react';
import "./index.css"
import NewsCard from "../../components/NewsCard";

const News = () => {
  const [news, setNews] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?category=health&apiKey=299d8bb678324a418b91eac611d6c0df', {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const articles = data.articles.filter(article => article.urlToImage != null).slice(0, 6);

        setNews(articles);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      }
    };

    const fetchAlertNews = async () => {
      try {
        const response = await fetch('https://newsapi.org/v2/everything?q=health-alerts&sortBy=publishedAt&apiKey=299d8bb678324a418b91eac611d6c0df', {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const articles = data.articles.filter(article => article.urlToImage != null).slice(0, 6);

        setAlerts(articles);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      }
    };

    fetchNews();
    fetchAlertNews();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100/80 to-blue-200 min-h-screen text-black text-lg font-light flex flex-col">
      <h1 className="text-4xl font-medium mb-8">Health News</h1>
      <div className="mb-8">
        <h2 className="text-3xl font-medium mb-4">Latest Medical News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.length > 0 ? (
            news.map((article, index) => (
              <NewsCard news={article} />
            ))
          ) : (
            <p className='text-lg'>News...</p>
          )}
        </div>
      </div>
      <div className="mb-2">
        <h2 className="text-3xl font-medium mb-3">Public Health Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.length > 0 ? (
              alerts.map((article) => (
                <NewsCard news={article} />
              ))
            ) : (
              <p className='text-lg'>News...</p>
            )}
        </div>
      </div>
    </div>
  )
}

export default News