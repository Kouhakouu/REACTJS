import TeacherClassPage from '@/components/teacher/teacherClass';

const Page = ({ params }: { params: { id: string } }) => {
    return <TeacherClassPage params={params} />;
};

export default Page;