import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Container,
    Title,
    Text,
    Card,
    Stack,
    Group,
    Badge,
    Button,
    Grid,
    Paper,
    Alert,
    Loader,
    Center,
    Divider,
    Box,
    Progress
} from '@mantine/core';
import {
    IconArrowLeft,
    IconHeart,
    IconCurrencyReal,
    IconCalendar,
    IconUser,
    IconCheck,
    IconClock,
    IconX,
    IconAlertCircle
} from '@tabler/icons-react';

interface Project {
    id: number;
    name: string;
    description: string;
    budget: number;
    current_amount: number;
    start_date: string;
    end_date: string;
    owner_name: string;
    cellphone: string;
    category: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Donation {
    id: number;
    amount: number;
    status: string;
    project_id: number;
    donor_name: string;
    cellphone: string;
    asaas_cliente_id: string;
    asaas_cobranca_id: string;
    created_at: string;
    updated_at: string;
}

interface ProjectDonatesResponse {
    project: Project;
    donates: Donation[];
}

export default function ProjectDetail() {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Buscar dados do projeto e suas doações
    useEffect(() => {
        const fetchProjectData = async () => {
            if (!projectId) return;

            try {
                setLoading(true);
                setError(null);

                // Buscar projeto
                const projectResponse = await fetch(`https://vaimebancar.codegus.com/api/projects/${projectId}`);
                if (!projectResponse.ok) {
                    throw new Error('Projeto não encontrado');
                }
                const projectData = await projectResponse.json();
                setProject(projectData);

                // Buscar doações do projeto
                const donationsResponse = await fetch(`https://vaimebancar.codegus.com/api/projects/${projectId}/donates`);
                if (donationsResponse.ok) {
                    const responseData: ProjectDonatesResponse = await donationsResponse.json();
                    console.log('Project donates data received:', responseData);
                    
                    // Usar os dados do projeto da resposta (mais atualizados)
                    if (responseData.project) {
                        setProject(responseData.project);
                    }
                    
                    // Usar as doações da resposta
                    const donationsArray = Array.isArray(responseData.donates) ? responseData.donates : [];
                    setDonations(donationsArray);

                    // Como as doações já têm status, não precisamos buscar separadamente
                    // Removido setPayments([]) pois não usamos mais payments
                }

            } catch (error) {
                console.error('Erro ao buscar dados do projeto:', error);
                setError('Erro ao carregar dados do projeto');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [projectId]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'pago':
                return 'green';
            case 'pending':
            case 'pendente':
                return 'yellow';
            case 'cancelled':
            case 'cancelado':
                return 'red';
            case 'overdue':
            case 'vencido':
                return 'orange';
            default:
                return 'gray';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'pago':
                return 'Pago';
            case 'pending':
            case 'pendente':
                return 'Pendente';
            case 'cancelled':
            case 'cancelado':
                return 'Cancelado';
            case 'overdue':
            case 'vencido':
                return 'Vencido';
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'pago':
                return <IconCheck size={16} />;
            case 'pending':
            case 'pendente':
                return <IconClock size={16} />;
            case 'cancelled':
            case 'cancelado':
                return <IconX size={16} />;
            case 'overdue':
            case 'vencido':
                return <IconAlertCircle size={16} />;
            default:
                return <IconClock size={16} />;
        }
    };

    const calculateProgress = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
    };

    // Função removida - as doações já têm status diretamente

    if (loading) {
        return (
            <Container size="lg" py="xl">
                <Center>
                    <Stack align="center" gap="md">
                        <Loader size="lg" />
                        <Text>Carregando dados do projeto...</Text>
                    </Stack>
                </Center>
            </Container>
        );
    }

    if (error || !project) {
        return (
            <Container size="lg" py="xl">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Erro"
                    color="red"
                    variant="light"
                >
                    {error || 'Projeto não encontrado'}
                </Alert>
                <Group justify="center" mt="md">
                    <Button component={Link} to="/" leftSection={<IconArrowLeft size={16} />}>
                        Voltar para Home
                    </Button>
                </Group>
            </Container>
        );
    }

    const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);

    return (
        <Container size="lg" py="xl">
            <Stack gap="lg">
                {/* Header */}
                <Group justify="space-between">
                    <Button
                        component={Link}
                        to="/"
                        leftSection={<IconArrowLeft size={16} />}
                        variant="light"
                    >
                        Voltar
                    </Button>
                    <Button
                        component={Link}
                        to="/register-donation"
                        leftSection={<IconHeart size={16} />}
                    >
                        Fazer Doação
                    </Button>
                </Group>

                {/* Informações do Projeto */}
                <Paper radius="md" p="xl" withBorder>
                    <Stack gap="lg">
                        <Group gap="sm">
                            <IconHeart size={32} color="var(--mantine-color-red-6)" />
                            <div>
                                <Title order={1}>{project.name}</Title>
                                <Text c="dimmed">por {project.owner_name}</Text>
                            </div>
                        </Group>

                        <Text size="lg">{project.description}</Text>

                        <Divider />

                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <Stack gap="xs">
                                    <Group gap="xs">
                                        <IconCurrencyReal size={20} />
                                        <Text fw={500}>Meta do Projeto</Text>
                                    </Group>
                                    <Text size="xl" fw={700} c="blue">
                                        {formatCurrency(project.budget)}
                                    </Text>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <Stack gap="xs">
                                    <Group gap="xs">
                                        <IconCurrencyReal size={20} />
                                        <Text fw={500}>Total Arrecadado</Text>
                                    </Group>
                                    <Text size="xl" fw={700} c="green">
                                        {formatCurrency(totalDonations)}
                                    </Text>
                                </Stack>
                            </Grid.Col>
                        </Grid>

                        <Box>
                            <Group justify="space-between" mb="xs">
                                <Text size="sm" fw={500}>Progresso</Text>
                                <Text size="sm" c="dimmed">
                                    {calculateProgress(totalDonations, project.budget).toFixed(1)}%
                                </Text>
                            </Group>
                            <Progress
                                value={calculateProgress(totalDonations, project.budget)}
                                size="lg"
                                radius="md"
                                color="green"
                            />
                        </Box>

                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <Group gap="xs">
                                    <IconCalendar size={20} />
                                    <div>
                                        <Text size="sm" c="dimmed">Início</Text>
                                        <Text fw={500}>{formatDate(project.start_date)}</Text>
                                    </div>
                                </Group>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <Group gap="xs">
                                    <IconCalendar size={20} />
                                    <div>
                                        <Text size="sm" c="dimmed">Término</Text>
                                        <Text fw={500}>{formatDate(project.end_date)}</Text>
                                    </div>
                                </Group>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Paper>

                {/* Lista de Doações */}
                <Paper radius="md" p="xl" withBorder>
                    <Stack gap="lg">
                        <Title order={2}>Doações Recebidas</Title>

                        {donations.length === 0 ? (
                            <Alert
                                icon={<IconHeart size={16} />}
                                title="Nenhuma doação ainda"
                                color="blue"
                                variant="light"
                            >
                                Este projeto ainda não recebeu doações. Seja o primeiro a contribuir!
                            </Alert>
                        ) : (
                            <Stack gap="md">
                                {donations.map((donation) => {
                                    const status = donation.status;

                                    return (
                                        <Card key={donation.id} shadow="sm" padding="lg" radius="md" withBorder>
                                            <Group justify="space-between" mb="md">
                                                <Group gap="sm">
                                                    <IconUser size={20} />
                                                    <div>
                                                        <Text fw={500}>{donation.donor_name}</Text>
                                                        <Text size="sm" c="dimmed">{donation.cellphone}</Text>
                                                    </div>
                                                </Group>
                                                <Badge
                                                    color={getStatusColor(status)}
                                                    leftSection={getStatusIcon(status)}
                                                >
                                                    {getStatusLabel(status)}
                                                </Badge>
                                            </Group>

                                            <Grid>
                                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                                    <Group gap="xs">
                                                        <IconCurrencyReal size={16} />
                                                        <Text size="sm" c="dimmed">Valor</Text>
                                                    </Group>
                                                    <Text fw={600} size="lg">
                                                        {formatCurrency(donation.amount)}
                                                    </Text>
                                                </Grid.Col>
                                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                                    <Group gap="xs">
                                                        <IconCalendar size={16} />
                                                        <Text size="sm" c="dimmed">Data da Doação</Text>
                                                    </Group>
                                                    <Text fw={500}>
                                                        {formatDate(donation.created_at)}
                                                    </Text>
                                                </Grid.Col>
                                            </Grid>
                                        </Card>
                                    );
                                })}
                            </Stack>
                        )}
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
}
