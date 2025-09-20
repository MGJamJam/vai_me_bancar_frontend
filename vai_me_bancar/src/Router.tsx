import {createBrowserRouter, Link, Route, RouterProvider, Routes} from 'react-router-dom';
import RegisterDonation from "./pages/RegisterDonation.tsx";
import RegisterProject from "./pages/RegisterProject.tsx";
import Homepage from "./pages/Homepage.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import {Anchor, AppShell, Button, Container, Flex, Group, Title} from "@mantine/core";
import {IconHeart, IconPlus} from "@tabler/icons-react";

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />, // This will be your AppShell component
        children: [
            {
                index: true, // This is the default route for '/'
                element: <Homepage />,
            },
            {
                path: 'register-project',
                element: <RegisterProject />,
            },
            {
                path: 'register-donation',
                element: <RegisterDonation />,
            },
            {
                path: 'project/:projectId',
                element: <ProjectDetail />,
            },
        ],
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}

function RootLayout() {
    return (
        <AppShell
            padding={0}
            header={{height: 70}}
        >
            <AppShell.Header>
                <Container size="xl" h="100%">
                    <Group justify="space-between" h="100%">
                        <Group gap="lg">
                            <Title order={3} c="blue">
                                <Anchor href="/" underline="never">
                                    Vai Me Bancar
                                </Anchor>
                            </Title>
                        </Group>
                        
                        <Group gap="md">
                            <Button
                                component={Link}
                                to="/register-donation"
                                leftSection={<IconHeart size={16} />}
                                variant="light"
                                size="sm"
                            >
                                Fazer Doação
                            </Button>
                            <Button
                                component={Link}
                                to="/register-project"
                                leftSection={<IconPlus size={16} />}
                                size="sm"
                            >
                                Criar Projeto
                            </Button>
                        </Group>
                    </Group>
                </Container>
            </AppShell.Header>
            
            <AppShell.Main>
                <Container size="xl" py="md">
                    <Routes>
                        <Route path="/register-project" element={<RegisterProject />} />
                        <Route path="/register-donation" element={<RegisterDonation />} />
                        <Route path="/project/:projectId" element={<ProjectDetail />} />
                        <Route path="/" element={<Homepage />} />
                    </Routes>
                </Container>
            </AppShell.Main>
        </AppShell>
    );
}
