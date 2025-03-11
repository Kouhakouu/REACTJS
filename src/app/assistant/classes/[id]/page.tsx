import AssistantClassPage from '@/components/assistant/assistantClassPage';

const Page = ({ params }: { params: { id: string } }) => {
    return <AssistantClassPage params={params} />;
};

export default Page;
