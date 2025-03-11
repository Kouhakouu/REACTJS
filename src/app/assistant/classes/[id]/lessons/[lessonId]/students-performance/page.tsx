import LessonStudentsPerformance from '@/components/assistant/lessonStudentsPerformance';

const LessonStudentsPerformancePage = ({ params }: { params: { id: string, lessonId: string } }) => {
    return <LessonStudentsPerformance params={params} />;
};

export default LessonStudentsPerformancePage;
