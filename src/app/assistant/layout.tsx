import AssistantContent from '@/components/layout/assistant/assistant.content';
import AssistantFooter from '@/components/layout/assistant/assistant.footer';
import AssistantHeader from '@/components/layout/assistant/assistant.header';
import AssistantSideBar from '@/components/layout/assistant/assistant.sidebar';
import AssistantGuard from '@/components/layout/assistant/assistantGuard';
import { AdminContextProvider } from '@/library/admin.context';

const AssistantLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <AdminContextProvider>
            <div style={{ display: "flex" }}>
                <div className='left-side'>
                    <AssistantSideBar />
                </div>
                <div className='right-side' style={{ flex: 1, minWidth: 0 }}>
                    <AssistantHeader />
                    <AssistantContent>
                        <AssistantGuard>
                            {children}
                        </AssistantGuard>
                    </AssistantContent>
                    <AssistantFooter />
                </div>
            </div>
        </AdminContextProvider>
    )
}

export default AssistantLayout