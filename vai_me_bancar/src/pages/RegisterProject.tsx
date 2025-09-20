import {useForm} from "@mantine/form";
import {Button, Group, Textarea, TextInput, Container, Title, Paper, Stack, Text, Alert} from "@mantine/core";
import { DateInput } from '@mantine/dates';
import {IconPlus, IconInfoCircle, IconCheck} from "@tabler/icons-react";
import {useState} from "react";


export default function RegisterProject() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const form = useForm({
        initialValues: {
            email: '',
            projectName: '',
            description: '',
            ownerName: '',
            startDate: '',
            endDate: '',
            cellphone: ''
        },

        validate: {
            // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        
        try {
            // send data to backend
            console.log(JSON.stringify(values.projectName));

            const payload = {
                name: values.projectName,
                description: values.description,
                owner_name: values.ownerName,
                cellphone: values.cellphone,
                budget: "1000.00", // Valor padrão temporário
                goal_amount: "1000.00", // Valor padrão temporário
                start_date: values.startDate ? new Date(values.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                end_date: values.endDate ? new Date(values.endDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias no futuro
            };

            console.log('Payload sendo enviado:', payload);

            const response = await fetch('https://vaimebancar.codegus.com/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log('Status da resposta:', response.status);
            console.log('Headers da resposta:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na resposta:', errorText);
                throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const responseText = await response.text();
                console.error('Resposta não é JSON:', responseText);
                throw new Error('A resposta não é um JSON válido');
            }

            const data = await response.json();
            console.log('Projeto criado com sucesso:', data);
            
            // Limpar o formulário após sucesso
            form.reset();
            setSuccess(true);
        } catch (error) {
            console.error('Erro ao enviar projeto:', error);
            alert('Erro ao registrar projeto. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container size="sm" py="xl">
            <Stack gap="lg">
                <Paper radius="md" p="xl" withBorder>
                    <Stack gap="lg">
                        <Group gap="sm">
                            <IconPlus size={32} color="var(--mantine-color-blue-6)" />
                            <div>
                                <Title order={1}>Criar Projeto</Title>
                                <Text c="dimmed">Crie seu projeto e comece a receber doações!</Text>
                            </div>
                        </Group>

                        {success && (
                            <Alert
                                icon={<IconCheck size={16} />}
                                title="Projeto Criado!"
                                color="green"
                                variant="light"
                            >
                                Seu projeto foi criado com sucesso e já está disponível para receber doações!
                            </Alert>
                        )}

                        <Alert
                            icon={<IconInfoCircle size={16} />}
                            title="Informações Importantes"
                            color="blue"
                            variant="light"
                        >
                            Após criar seu projeto, ele ficará disponível para receber doações. 
                            Você poderá acompanhar o progresso e gerenciar as contribuições recebidas.
                        </Alert>

                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack gap="md">
                                <TextInput
                                    withAsterisk
                                    label="Nome do Projeto"
                                    placeholder="Chegar até a lua"
                                    key={form.key('projectName')}
                                    {...form.getInputProps('projectName')}
                                />

                                <Textarea
                                    withAsterisk
                                    label="Descrição"
                                    placeholder="Construir foguetes, bora que bora!"
                                    minRows={3}
                                    key={form.key('description')}
                                    {...form.getInputProps('description')}
                                />

                                <TextInput
                                    withAsterisk
                                    label="Nome do Responsável"
                                    placeholder="Bianca Duarte"
                                    key={form.key('ownerName')}
                                    {...form.getInputProps('ownerName')}
                                />

                                <DateInput
                                    withAsterisk
                                    valueFormat="DD/MM/YYYY"
                                    label="Data de Início"
                                    placeholder="Selecione a data"
                                    key={form.key('startDate')}
                                    {...form.getInputProps('startDate')}
                                />

                                <DateInput
                                    withAsterisk
                                    valueFormat="DD/MM/YYYY"
                                    label="Data de Término"
                                    placeholder="Selecione a data"
                                    key={form.key('endDate')}
                                    {...form.getInputProps('endDate')}
                                />

                                <TextInput
                                    withAsterisk
                                    label="Telefone"
                                    placeholder="11999999999"
                                    key={form.key('cellphone')}
                                    {...form.getInputProps('cellphone')}
                                />

                                <Group justify="flex-end" mt="md">
                                    <Button 
                                        type="submit" 
                                        loading={loading} 
                                        disabled={loading}
                                        leftSection={<IconPlus size={16} />}
                                        size="md"
                                    >
                                        {loading ? 'Criando...' : 'Criar Projeto'}
                                    </Button>
                                </Group>
                            </Stack>
                        </form>
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
}
