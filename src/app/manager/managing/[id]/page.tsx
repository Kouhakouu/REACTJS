import Class from '@/components/manager/class';

const Page = ({ params }: { params: { id: string } }) => {
    return <Class params={params} />;
};

export default Page;
