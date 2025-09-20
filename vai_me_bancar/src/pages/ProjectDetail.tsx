import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
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
    Progress,
    Modal
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
    IconAlertCircle,
    IconExternalLink
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
    donation_type: string;
    donation_message: string;
    created_at: string;
    updated_at: string;
}

interface FundraisingStats {
    help_amount: number;
    stop_amount: number;
    total_amount: number;
    help_percentage: number;
    stop_percentage: number;
    stop_wins: boolean;
    troll_message: string;
    help_count: number;
    stop_count: number;
}

interface ProjectInfoResponse {
    project: Project;
    progress_percentage: number;
    time_remaining: string;
    is_goal_reached: boolean;
    daily_ranking: Donation[];
    top_donor_today: Donation;
    lowest_donor_today: Donation;
    fundraising_stats: FundraisingStats;
}

export default function ProjectDetail() {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [projectInfo, setProjectInfo] = useState<ProjectInfoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stopWinsModalOpen, setStopWinsModalOpen] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // Buscar dados do projeto e suas doações
    useEffect(() => {
        const fetchProjectData = async () => {
            if (!projectId) return;

            try {
                setLoading(true);
                setError(null);

                // Buscar informações completas do projeto
                const response = await fetch(`https://vaimebancar.codegus.com/api/projects/${projectId}/info`);
                if (!response.ok) {
                    throw new Error('Projeto não encontrado');
                }

                const data: ProjectInfoResponse = await response.json();
                console.log('Project info data received:', data);

                // Armazenar todas as informações
                setProjectInfo(data);
                setProject(data.project);
                setDonations(data.daily_ranking || []);

                // Verificar se stop_wins é true e abrir modal
                if (data.fundraising_stats.stop_wins) {
                    setStopWinsModalOpen(true);
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

    // Timer para redirecionamento automático
    useEffect(() => {
        let timer: number;
        
        if (stopWinsModalOpen && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        handleYouTubeRedirect();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [stopWinsModalOpen, countdown]);

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

    const handleYouTubeRedirect = () => {
        window.open('https://www.youtube.com/watch?v=umDr0mPuyQc', '_blank');
        setStopWinsModalOpen(false);
        setCountdown(5);
    };

    const handleCloseModal = () => {
        setStopWinsModalOpen(false);
        setCountdown(5);
    };

    // Função removida - as doações já têm status diretamente

    if (loading) {
        return (
            <Center py="xl">
                <Stack align="center" gap="md">
                    <Loader size="lg" />
                    <Text>Carregando dados do projeto...</Text>
                </Stack>
            </Center>
        );
    }

    if (error || !project) {
        return (
            <Stack gap="md">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Erro"
                    color="red"
                    variant="light"
                >
                    {error || 'Projeto não encontrado'}
                </Alert>
                <Group justify="center">
                    <Button component={Link} to="/" leftSection={<IconArrowLeft size={16} />}>
                        Voltar para Home
                    </Button>
                </Group>
            </Stack>
        );
    }

    const totalDonations = projectInfo ? projectInfo.fundraising_stats.total_amount : donations.reduce((sum, donation) => sum + donation.amount, 0);
    const helpAmount = projectInfo ? projectInfo.fundraising_stats.help_amount : 0;
    const stopAmount = projectInfo ? projectInfo.fundraising_stats.stop_amount : 0;

    return (
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

                        {/* Estatísticas de Fundraising */}
                        {projectInfo && (
                            <Paper radius="md" p="md" bg="gray.0">
                                <Title order={3} mb="md">Estatísticas de Arrecadação</Title>
                                <Grid>
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <Stack gap="xs">
                                            <Text size="sm" c="dimmed">Ajuda (Help)</Text>
                                            <Text fw={600} c="green">
                                                {formatCurrency(helpAmount)} ({projectInfo.fundraising_stats.help_percentage.toFixed(1)}%)
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                {projectInfo.fundraising_stats.help_count} doações
                                            </Text>
                                        </Stack>
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <Stack gap="xs">
                                            <Text size="sm" c="dimmed">Parar (Stop)</Text>
                                            <Text fw={600} c="red">
                                                {formatCurrency(stopAmount)} ({projectInfo.fundraising_stats.stop_percentage.toFixed(1)}%)
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                {projectInfo.fundraising_stats.stop_count} doações
                                            </Text>
                                        </Stack>
                                    </Grid.Col>
                                </Grid>

                                {projectInfo.fundraising_stats.stop_wins && (
                                    <Alert
                                        icon={<IconAlertCircle size={16} />}
                                        title="Para logo esse projeto!"
                                        color="red"
                                        variant="light"
                                        mt="md"
                                    >
                                        {projectInfo.fundraising_stats.troll_message}
                                    </Alert>
                                )}
                            </Paper>
                        )}

                        <Box>
                            <Group justify="space-between" mb="xs">
                                <Text size="sm" fw={500}>Progresso</Text>
                                <Text size="sm" c="dimmed">
                                    {projectInfo ? `${projectInfo.progress_percentage.toFixed(1)}%` : `${calculateProgress(totalDonations, project.budget).toFixed(1)}%`}
                                </Text>
                            </Group>
                            <Progress
                                value={projectInfo ? projectInfo.progress_percentage : calculateProgress(totalDonations, project.budget)}
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

                        {projectInfo && (
                            <Alert
                                icon={<IconCalendar size={16} />}
                                title="Tempo Restante"
                                color="blue"
                                variant="light"
                            >
                                {projectInfo.time_remaining}
                                {projectInfo.is_goal_reached && (
                                    <Text fw={600} c="green" mt="xs">
                                        🎉 Meta alcançada!
                                    </Text>
                                )}
                            </Alert>
                        )}
                    </Stack>
                </Paper>

                {/* Destaques do Dia */}
                {projectInfo && (projectInfo.top_donor_today || projectInfo.lowest_donor_today) && (
                    <Paper radius="md" p="xl" withBorder>
                        <Stack gap="lg">
                            <Title order={2}>Destaques do Dia</Title>

                            <Grid>
                                {projectInfo.top_donor_today && (
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <Card shadow="sm" padding="lg" radius="md" withBorder bg="green.0">
                                            <Stack gap="sm">
                                                <Group gap="sm">
                                                    <IconHeart size={20} color="var(--mantine-color-green-6)" />
                                                    <Text fw={600} c="green">Maior Doador do Dia</Text>
                                                </Group>
                                                <Text fw={500}>{projectInfo.top_donor_today.donor_name}</Text>
                                                <Text size="xl" fw={700} c="green">
                                                    {formatCurrency(projectInfo.top_donor_today.amount)}
                                                </Text>
                                                <Badge
                                                    color={projectInfo.top_donor_today.donation_type === 'help' ? 'green' : 'red'}
                                                    variant="light"
                                                    size="sm"
                                                >
                                                    {projectInfo.top_donor_today.donation_type === 'help' ? 'Ajuda' : 'Parar'}
                                                </Badge>
                                                {projectInfo.top_donor_today.donation_message && (
                                                    <Text size="sm" c="dimmed" fs="italic">
                                                        "{projectInfo.top_donor_today.donation_message}"
                                                    </Text>
                                                )}
                                            </Stack>
                                        </Card>
                                    </Grid.Col>
                                )}

                                {projectInfo.lowest_donor_today && (
                                    <Grid.Col span={{ base: 12, sm: 6 }}>
                                        <Card shadow="sm" padding="lg" radius="md" withBorder bg="blue.0">
                                            <Stack gap="sm">
                                                <Group gap="sm">
                                                    <IconHeart size={20} color="var(--mantine-color-blue-6)" />
                                                    <Text fw={600} c="blue">Menor Doador do Dia</Text>
                                                </Group>
                                                <Text fw={500}>{projectInfo.lowest_donor_today.donor_name}</Text>
                                                <Text size="xl" fw={700} c="blue">
                                                    {formatCurrency(projectInfo.lowest_donor_today.amount)}
                                                </Text>
                                                <Badge
                                                    color={projectInfo.lowest_donor_today.donation_type === 'help' ? 'green' : 'red'}
                                                    variant="light"
                                                    size="sm"
                                                >
                                                    {projectInfo.lowest_donor_today.donation_type === 'help' ? 'Ajuda' : 'Parar'}
                                                </Badge>
                                                {projectInfo.lowest_donor_today.donation_message && (
                                                    <Text size="sm" c="dimmed" fs="italic">
                                                        "{projectInfo.lowest_donor_today.donation_message}"
                                                    </Text>
                                                )}
                                            </Stack>
                                        </Card>
                                    </Grid.Col>
                                )}
                            </Grid>
                        </Stack>
                    </Paper>
                )}

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

                                            <Grid>
                                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                                    <Group gap="xs">
                                                        <Text size="sm" c="dimmed">Tipo</Text>
                                                    </Group>
                                                    <Badge
                                                        color={donation.donation_type === 'help' ? 'green' : 'red'}
                                                        variant="light"
                                                    >
                                                        {donation.donation_type === 'help' ? 'Ajuda' : 'Parar'}
                                                    </Badge>
                                                </Grid.Col>
                                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                                    {donation.donation_message && (
                                                        <Group gap="xs">
                                                            <Text size="sm" c="dimmed">Mensagem</Text>
                                                        </Group>
                                                    )}
                                                    {donation.donation_message && (
                                                        <Text size="sm" fw={500} c="dimmed">
                                                            "{donation.donation_message}"
                                                        </Text>
                                                    )}
                                                </Grid.Col>
                                            </Grid>
                                        </Card>
                                    );
                                })}
                            </Stack>
                        )}
                    </Stack>
                </Paper>

            {/* Modal Stop Wins */}
            <Modal
                opened={stopWinsModalOpen}
                onClose={handleCloseModal}
                title={
                    <Group gap="sm">
                        <IconX size={24} color="var(--mantine-color-red-6)" />
                        <Text size="xl" fw={700} c="red">PROJETO PARADO! 🛑</Text>
                    </Group>
                }
                size="lg"
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <Stack gap="lg">
                    <Paper radius="md" p="lg" bg="red.0" withBorder>
                        <Stack gap="md" align="center">
                            <Text size="xl" fw={700} c="red" ta="center">
                                🎉 PARABÉNS! VOCÊ CONSEGUIU PARAR ESSE PROJETO! 🎉
                            </Text>
                            <Text size="lg" ta="center" c="dimmed">
                                O projeto <strong>"{project?.name}"</strong> foi oficialmente 
                                <strong> PARADO DE VEZ</strong> graças às suas doações "STOP"!
                            </Text>
                            <Text size="md" ta="center" c="dimmed">
                                {projectInfo?.fundraising_stats.troll_message}
                            </Text>
                        </Stack>
                    </Paper>

                    <Alert
                        icon={<IconAlertCircle size={20} />}
                        title="Missão Cumprida!"
                        color="red"
                        variant="light"
                    >
                        <Text>
                            O projeto não vai mais receber doações e foi oficialmente cancelado. 
                            Você fez a diferença impedindo que algo questionável acontecesse!
                        </Text>
                    </Alert>

                    {/* Contador Regressivo */}
                    <Paper radius="md" p="md" bg="yellow.0" withBorder>
                        <Stack gap="sm" align="center">
                            <Text size="lg" fw={600} c="orange" ta="center">
                                ⏰ Redirecionamento automático em:
                            </Text>
                            <Text size="2xl" fw={700} c="red" ta="center">
                                {countdown} segundos
                            </Text>
                            <Text size="sm" c="dimmed" ta="center">
                                Você será redirecionado para uma música de celebração!
                            </Text>
                        </Stack>
                    </Paper>

                    <Group justify="center" gap="md">
                        <Button
                            onClick={handleYouTubeRedirect}
                            size="lg"
                            color="red"
                            leftSection={<IconExternalLink size={20} />}
                        >
                            🎵 Comemorar com uma Música! 🎵
                        </Button>
                        <Button
                            onClick={handleCloseModal}
                            variant="outline"
                            size="lg"
                        >
                            Fechar
                        </Button>
                    </Group>

                    <Text size="sm" c="dimmed" ta="center">
                        Clique em "Comemorar" para ouvir uma música especial de celebração! 🎶
                    </Text>
                </Stack>
            </Modal>
        </Stack>
    );
}
