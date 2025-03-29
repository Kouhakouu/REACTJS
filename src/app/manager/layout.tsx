
import ManagerContent from '@/components/layout/manager/manager.content';
import ManagerFooter from '@/components/layout/manager/manager.footer';
import ManagerHeader from '@/components/layout/manager/manager.header';
import ManagerSideBar from '@/components/layout/manager/manager.sidebar';
import { AdminContextProvider } from '@/library/admin.context';

const ManagerLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <AdminContextProvider>
            <div style={{ display: "flex" }}>
                <div className='left-side' style={{ minWidth: 80 }}>
                    <ManagerSideBar />
                </div>
                <div className='right-side' style={{ flex: 1 }}>
                    <ManagerHeader />
                    <ManagerContent>
                        {children}
                    </ManagerContent>
                    <ManagerFooter />
                </div>
            </div>
        </AdminContextProvider>
    )
}

export default ManagerLayout