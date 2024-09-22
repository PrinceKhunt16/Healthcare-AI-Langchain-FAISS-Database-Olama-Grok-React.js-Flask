const NewsCard = ({ news }) => {
    return (
        <div className="bg-slate-200/90 shadow-lg rounded-lg">
            <div className="">
                <img
                    src={news.urlToImage}
                    alt={news.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            </div>
            <div className="p-4">
            <h2 className="text-2xl font-semibold mb-2">{news.title}</h2>
            <p className="text-slate-700 mb-4">{news.description}</p>
            <p className="text-sm text-slate-500 mb-4">
                Published at: {new Date(news.publishedAt).toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mb-2">
                Author: {news.author} 
            </p>
            <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
            >
                Read full article
            </a>
            </div>
        </div>
    );
};

export default NewsCard;