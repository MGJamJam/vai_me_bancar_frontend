import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Card,
    Grid,
    TextInput,
    Badge,
    Stack,
    Box,
    ThemeIcon,
    SimpleGrid,
    Center,
    Paper,
    Divider,
    Anchor
} from '@mantine/core';
import { IconHeart, IconSearch, IconPlus, IconTarget, IconUsers, IconCurrencyReal, IconX } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

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

export default function Homepage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Buscar projetos da API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('https://vaimebancar.codegus.com/api/projects');
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                    setFilteredProjects(data);
                }
            } catch (error) {
                console.error('Erro ao buscar projetos:', error);
                // Dados de exemplo em caso de erro
                const mockProjects: Project[] = [
                    {
                        id: 1,
                        name: "Construção de Escola Rural",
                        description: "Projeto para construir uma escola em comunidade rural carente",
                        owner_name: "Maria Silva",
                        budget: 50000,
                        current_amount: 25000,
                        start_date: "2024-01-01",
                        end_date: "2024-12-31",
                        status: "active"
                    },
                    {
                        id: 2,
                        name: "Tratamento Médico",
                        description: "Custos para tratamento de câncer de uma criança",
                        owner_name: "João Santos",
                        budget: 30000,
                        current_amount: 15000,
                        start_date: "2024-02-01",
                        end_date: "2024-08-31",
                        status: "active"
                    },
                    {
                        id: 3,
                        name: "Projeto Ambiental",
                        description: "Reflorestamento de área degradada",
                        owner_name: "Ana Costa",
                        budget: 20000,
                        current_amount: 5000,
                        start_date: "2024-03-01",
                        end_date: "2024-11-30",
                        status: "active"
                    }
                ];
                setProjects(mockProjects);
                setFilteredProjects(mockProjects);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Filtrar projetos baseado na busca
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProjects(projects);
        } else {
            const filtered = projects.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProjects(filtered);
        }
    }, [searchTerm, projects]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    };

    const calculateProgress = (current: number, budget: number) => {
        return Math.min((current / budget) * 100, 100);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'green';
            case 'completed': return 'blue';
            case 'cancelled': return 'red';
            default: return 'gray';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Ativo';
            case 'completed': return 'Concluído';
            case 'cancelled': return 'Cancelado';
            default: return 'Desconhecido';
        }
    };

    return (
        <Box>
            {/* Hero Section */}
            <Paper
                radius="md"
                p="xl"
                mb="xl"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}
            >
                <Container size="lg">
                    <Center>
                        <Stack align="center" gap="lg">
                            <ThemeIcon size={80} radius="xl" color="white" variant="light">
                                <IconHeart size={40} />
                            </ThemeIcon>
                            <Title order={1} size="h1" ta="center">
                                Vai Me Bancar
                            </Title>
                            <Text size="lg" ta="center" maw={600}>
                                A plataforma onde você pode ajudar projetos incríveis ou parar aqueles que não fazem sentido! 
                                Escolha seu lado: contribua para o sucesso ou pare projetos questionáveis.
                            </Text>
                            <Group>
                                <Button
                                    component={Link}
                                    to="/register-donation"
                                    size="lg"
                                    leftSection={<IconHeart size={20} />}
                                    variant="white"
                                    color="dark"
                                >
                                    Fazer Doação
                                </Button>
                                <Button
                                    component={Link}
                                    to="/register-project"
                                    size="lg"
                                    leftSection={<IconPlus size={20} />}
                                    variant="outline"
                                    color="white"
                                >
                                    Criar Projeto
                                </Button>
                            </Group>
                        </Stack>
                    </Center>
                </Container>
            </Paper>

            {/* Como Funciona */}
                <Box mb="xl">
                    <Title order={2} mb="lg" ta="center">Como Funciona</Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Stack align="center" gap="md">
                                <ThemeIcon size={60} radius="xl" color="blue" variant="light">
                                    <IconTarget size={30} />
                                </ThemeIcon>
                                <Title order={3} ta="center">1. Escolha um Projeto</Title>
                                <Text ta="center" c="dimmed">
                                    Navegue pelos projetos disponíveis e escolha aquele que mais te interessa.
                                </Text>
                            </Stack>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Stack align="center" gap="md">
                                <ThemeIcon size={60} radius="xl" color="green" variant="light">
                                    <IconCurrencyReal size={30} />
                                </ThemeIcon>
                                <Title order={3} ta="center">2. Escolha seu Lado</Title>
                                <Text ta="center" c="dimmed">
                                    <strong>HELP:</strong> Ajude projetos que você acredita<br/>
                                    <strong>STOP:</strong> Pare projetos questionáveis
                                </Text>
                            </Stack>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Stack align="center" gap="md">
                                <ThemeIcon size={60} radius="xl" color="orange" variant="light">
                                    <IconUsers size={30} />
                                </ThemeIcon>
                                <Title order={3} ta="center">3. Veja o Resultado</Title>
                                <Text ta="center" c="dimmed">
                                    Acompanhe a batalha entre Help e Stop em tempo real!
                                </Text>
                            </Stack>
                        </Card>
                    </SimpleGrid>
                </Box>

                <Divider my="xl" />

                {/* Help vs Stop */}
                <Box mb="xl">
                    <Title order={2} mb="lg" ta="center">Help vs Stop</Title>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                        <Card shadow="sm" padding="xl" radius="md" withBorder bg="green.0">
                            <Stack align="center" gap="md">
                                <ThemeIcon size={80} radius="xl" color="green" variant="filled">
                                    <IconHeart size={40} />
                                </ThemeIcon>
                                <Title order={2} ta="center" c="green">HELP</Title>
                                <Text ta="center" size="lg" fw={500}>
                                    Ajude projetos que você acredita!
                                </Text>
                                <Text ta="center" c="dimmed">
                                    Contribua para projetos que fazem sentido, que podem mudar vidas 
                                    e fazer a diferença no mundo. Sua doação ajuda a alcançar metas 
                                    importantes e realiza sonhos.
                                </Text>
                                <Group gap="sm" mt="md">
                                    <Badge color="green" size="lg">Apoio</Badge>
                                    <Badge color="green" size="lg">Sucesso</Badge>
                                    <Badge color="green" size="lg">Impacto</Badge>
                                </Group>
                            </Stack>
                        </Card>

                        <Card shadow="sm" padding="xl" radius="md" withBorder bg="red.0">
                            <Stack align="center" gap="md">
                                <ThemeIcon size={80} radius="xl" color="red" variant="filled">
                                    <IconX size={40} />
                                </ThemeIcon>
                                <Title order={2} ta="center" c="red">STOP</Title>
                                <Text ta="center" size="lg" fw={500}>
                                    Pare projetos questionáveis!
                                </Text>
                                <Text ta="center" c="dimmed">
                                    Contribua para parar projetos que não fazem sentido, são 
                                    questionáveis ou podem causar danos. Sua doação "Stop" 
                                    ajuda a impedir que projetos ruins sejam realizados.
                                </Text>
                                <Group gap="sm" mt="md">
                                    <Badge color="red" size="lg">Proteção</Badge>
                                    <Badge color="red" size="lg">Prevenção</Badge>
                                    <Badge color="red" size="lg">Controle</Badge>
                                </Group>
                            </Stack>
                        </Card>
                    </SimpleGrid>
                    
                    <Paper radius="md" p="lg" mt="lg" bg="blue.0">
                        <Stack align="center" gap="md">
                            <Title order={3} ta="center" c="blue">A Batalha em Tempo Real</Title>
                            <Text ta="center" c="dimmed">
                                Cada projeto tem uma batalha entre Help e Stop acontecendo em tempo real. 
                                Veja qual lado está ganhando, acompanhe as estatísticas e participe da decisão!
                            </Text>
                            <Group gap="md">
                                <Badge color="green" size="lg" variant="filled">Help Wins</Badge>
                                <Badge color="red" size="lg" variant="filled">Stop Wins</Badge>
                            </Group>
                        </Stack>
                    </Paper>
                </Box>

                <Divider my="xl" />

                {/* Busca de Projetos */}
                <Box mb="lg">
                    <Group justify="space-between" mb="md">
                        <Title order={2}>Projetos Disponíveis</Title>
                        <TextInput
                            placeholder="Buscar projetos..."
                            leftSection={<IconSearch size={16} />}
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.currentTarget.value)}
                            style={{ minWidth: 300 }}
                        />
                    </Group>

                    {loading ? (
                        <Center p="xl">
                            <Text>Carregando projetos...</Text>
                        </Center>
                    ) : filteredProjects.length === 0 ? (
                        <Center p="xl">
                            <Stack align="center" gap="md">
                                <Text size="lg" c="dimmed">Nenhum projeto encontrado</Text>
                                <Text c="dimmed">
                                    {searchTerm ? 'Tente ajustar sua busca' : 'Não há projetos disponíveis no momento'}
                                </Text>
                            </Stack>
                        </Center>
                    ) : (
                        <Grid>
                            {filteredProjects.map((project) => (
                                <Grid.Col key={project.id} span={{ base: 12, sm: 6, md: 4 }}>
                                    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                                        <Stack gap="sm" h="100%">
                                            <Group justify="space-between">
                                                <Badge color={getStatusColor(project.status)}>
                                                    {getStatusLabel(project.status)}
                                                </Badge>
                                                <Text size="sm" c="dimmed">
                                                    por {project.owner_name}
                                                </Text>
                                            </Group>

                                            <Title order={3} size="h4">
                                                {project.name}
                                            </Title>

                                            <Text size="sm" c="dimmed" lineClamp={3}>
                                                {project.description}
                                            </Text>

                                            <Box style={{ flex: 1 }} />

                                            <Stack gap="xs">
                                                <Group justify="space-between">
                                                    <Text size="sm" fw={500}>
                                                        {formatCurrency(project.current_amount || 0)}
                                                    </Text>
                                                    <Text size="sm" c="dimmed">
                                                        de {formatCurrency(project.budget)}
                                                    </Text>
                                                </Group>

                                                <Box
                                                    style={{
                                                        height: 8,
                                                        backgroundColor: '#e9ecef',
                                                        borderRadius: 4,
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <Box
                                                        style={{
                                                            height: '100%',
                                                            width: `${calculateProgress(project.current_amount || 0, project.budget)}%`,
                                                            backgroundColor: '#51cf66',
                                                            transition: 'width 0.3s ease'
                                                        }}
                                                    />
                                                </Box>

                                                <Text size="xs" c="dimmed" ta="center">
                                                    {calculateProgress(project.current_amount || 0, project.budget).toFixed(1)}% concluído
                                                </Text>
                                            </Stack>

                                            <Button
                                                component={Link}
                                                to={`/project/${project.id}`}
                                                fullWidth
                                                leftSection={<IconHeart size={16} />}
                                                mt="md"
                                            >
                                                Ver Detalhes
                                            </Button>
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            ))}
                        </Grid>
                    )}
                </Box>

                {/* Call to Action Final */}
                <Paper radius="md" p="xl" mt="xl" bg="gray.0">
                    <Center>
                        <Stack align="center" gap="lg">
                            <Title order={2} ta="center">
                                Pronto para Escolher seu Lado?
                            </Title>
                            <Text size="lg" ta="center" c="dimmed" maw={500}>
                                Junte-se à batalha entre Help e Stop! Contribua para projetos que você acredita 
                                ou pare aqueles que não fazem sentido. Sua voz importa!
                            </Text>
                            <Group>
                                <Button
                                    component={Link}
                                    to="/register-donation"
                                    size="lg"
                                    leftSection={<IconHeart size={20} />}
                                >
                                    Fazer Doação (Help/Stop)
                                </Button>
                                <Button
                                    component={Link}
                                    to="/register-project"
                                    size="lg"
                                    variant="outline"
                                    leftSection={<IconPlus size={20} />}
                                >
                                    Criar Meu Projeto
                                </Button>
                            </Group>
                        </Stack>
                    </Center>
                </Paper>
        </Box>
    );
}
