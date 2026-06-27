import NewsDetail from '@/components/news/newsDetail';

const NewsDetailPage = ({ params }: { params: { slug: string } }) => {
    return <NewsDetail slug={params.slug} />;
};

export default NewsDetailPage;
