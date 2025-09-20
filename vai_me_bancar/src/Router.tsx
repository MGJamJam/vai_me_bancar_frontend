import {createBrowserRouter, Link, Route, RouterProvider, Routes} from 'react-router-dom';
import RegisterDonation from "./pages/RegisterDonation.tsx";
import RegisterProject from "./pages/RegisterProject.tsx";
import {Anchor, AppShell, Button, Container, Flex} from "@mantine/core";

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />, // This will be your AppShell component
        children: [
            {
                index: true, // This is the default route for '/'
                element: <div>Start</div>,
            },
            {
                path: 'register-project',
                element: <RegisterProject />,
            },
            {
                path: 'register-donation',
                element: <RegisterDonation />,
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
                padding="md"
                header={{height: 40}}
            >
                <AppShell.Header>
                    <Flex gap="md"
                          justify="flex-start"
                          align="center"
                          direction="row"
                          ml={"lg"}
                    h={"100%"}>
                    <Anchor href="/register-project">Registrar Projeto</Anchor>
                    <Anchor href="/register-donation">Registrar Doação</Anchor>
                    </Flex>
                </AppShell.Header>
                <AppShell.Main>
                <Container size="sm">
                    <Routes>
                        <Route path="/register-project" element={<RegisterProject />} />
                        <Route path="/register-donation" element={<RegisterDonation />} />
                        <Route path="/" element={<div>Bem-vindo ao projeto de vaquinha!</div>} />
                    </Routes>
                </Container>
                </AppShell.Main>
            </AppShell>
    );
}
