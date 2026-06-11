
import TeacherContent from '@/components/layout/teacher/teacher.content';
import TeacherFooter from '@/components/layout/teacher/teacher.footer';
import TeacherHeader from '@/components/layout/teacher/teacher.header';
import TeacherSideBar from '@/components/layout/teacher/teacher.sidebar';
import { AdminContextProvider } from '@/library/admin.context';

const TeacherLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <AdminContextProvider>
            <div style={{ display: "flex" }}>
                <div className='left-side'>
                    <TeacherSideBar />
                </div>
                <div className='right-side' style={{ flex: 1, minWidth: 0 }}>
                    <TeacherHeader />
                    <TeacherContent>
                        {children}
                    </TeacherContent>
                    <TeacherFooter />
                </div>
            </div>
        </AdminContextProvider>
    )
}

export default TeacherLayout