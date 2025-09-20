import {useForm} from "@mantine/form";
import {Button, Group, NumberInput, Select, TextInput, Container, Title, Paper, Stack, Text, Alert, Divider} from "@mantine/core";
import {useEffect, useState} from "react";
import {IconHeart, IconInfoCircle, IconCheck, IconDownload, IconMapPin} from "@tabler/icons-react";

export default function RegisterDonation() {


    const [projects, setProjects] = useState<Array<{value: string, label: string}>>([]);
    const [projectsData, setProjectsData] = useState<Array<{id: number, name: string}>>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [boletoData, setBoletoData] = useState<{
        boletoUrl: string;
        paymentId: string;
        dueDate: string;
        amount: number;
    } | null>(null);

    // Buscar projetos disponíveis
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('https://vaimebancar.codegus.com/api/projects');
                if (response.ok) {
                    const data = await response.json();
                    const projectOptions = data.map((project: any) => ({
                        value: project.id.toString(),
                        label: project.name
                    }));
                    setProjects(projectOptions);
                    setProjectsData(data.map((project: any) => ({
                        id: project.id,
                        name: project.name
                    })));
                }
            } catch (error) {
                console.error('Erro ao buscar projetos:', error);
                // Fallback para projetos estáticos em caso de erro
                setProjects([
                    { value: '1', label: 'Projeto 1' },
                    { value: '2', label: 'Projeto 2' },
                    { value: '3', label: 'Projeto 3' },
                ]);
            }
        };

        fetchProjects();
    }, []);

    const form = useForm({
        initialValues: {
            amount: '',
            donor_name: '',
            cellphone: '',
            project_id: '',
            // Campos de endereço para o boleto
            email: '',
            cpf: '',
            postal_code: '',
            address: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: ''
        },

        validate: {
            amount: (value) => (!value || parseFloat(value) <= 0 ? 'Valor deve ser maior que zero' : null),
            donor_name: (value) => (!value ? 'Nome do doador é obrigatório' : null),
            cellphone: (value) => (!value ? 'Telefone é obrigatório' : null),
            project_id: (value) => (!value ? 'Projeto é obrigatório' : null),
            email: (value) => (!value ? 'Email é obrigatório' : (/^\S+@\S+$/.test(value) ? null : 'Email inválido')),
            cpf: (value) => (!value ? 'CPF é obrigatório' : null),
            postal_code: (value) => (!value ? 'CEP é obrigatório' : null),
            address: (value) => (!value ? 'Endereço é obrigatório' : null),
            number: (value) => (!value ? 'Número é obrigatório' : null),
            neighborhood: (value) => (!value ? 'Bairro é obrigatório' : null),
            city: (value) => (!value ? 'Cidade é obrigatória' : null),
            state: (value) => (!value ? 'Estado é obrigatório' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        
        try {
            // send data to backend
            console.log(JSON.stringify(values));

            // Encontrar o nome do projeto selecionado
            const selectedProject = projectsData.find(p => p.id === parseInt(values.project_id));
            const projectName = selectedProject ? selectedProject.name : 'Projeto';

            const payload = {
                amount: parseFloat(values.amount),
                project_id: parseInt(values.project_id),
                donor_name: values.donor_name,
                donor_email: values.email,
                donor_cpf: values.cpf,
                donor_phone: values.cellphone,
                donor_address: `${values.address}, ${values.number}${values.complement ? ', ' + values.complement : ''}`,
                donor_city: values.city,
                donor_state: values.state,
                donor_zipcode: values.postal_code,
                description: `Doação para o projeto: ${projectName}`
            };

            console.log('Payload sendo enviado:', payload);

            const response = await fetch('https://vaimebancar.codegus.com/api/donates/boleto', {
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
            console.log('Pagamento criado com sucesso:', data);
            
            // Armazenar dados do boleto
            setBoletoData({
                boletoUrl: data.boleto_url || data.boletoUrl,
                paymentId: data.id || data.payment_id,
                dueDate: data.due_date || data.dueDate,
                amount: parseFloat(values.amount)
            });
            
            // Limpar o formulário após sucesso
            form.reset();
            setSuccess(true);
        } catch (error) {
            console.error('Erro ao enviar pagamento:', error);
            alert('Erro ao gerar boleto. Tente novamente.');
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
                            <IconHeart size={32} color="var(--mantine-color-red-6)" />
                            <div>
                                <Title order={1}>Fazer Doação</Title>
                                <Text c="dimmed">Contribua para um projeto e faça a diferença!</Text>
                            </div>
                        </Group>

                        {success && boletoData && (
                            <Alert
                                icon={<IconCheck size={16} />}
                                title="Boleto Gerado com Sucesso!"
                                color="green"
                                variant="light"
                            >
                                <Stack gap="sm">
                                    <Text>
                                        Seu boleto foi gerado com sucesso! 
                                        Valor: <strong>R$ {boletoData.amount.toFixed(2)}</strong>
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        Vencimento: {new Date(boletoData.dueDate).toLocaleDateString('pt-BR')}
                                    </Text>
                                    <Button
                                        component="a"
                                        href={boletoData.boletoUrl}
                                        target="_blank"
                                        leftSection={<IconDownload size={16} />}
                                        color="green"
                                        variant="filled"
                                        fullWidth
                                    >
                                        Baixar Boleto
                                    </Button>
                                </Stack>
                            </Alert>
                        )}

                        <Alert
                            icon={<IconInfoCircle size={16} />}
                            title="Informações Importantes"
                            color="blue"
                            variant="light"
                        >
                            Após preencher os dados, será gerado um boleto bancário para pagamento.
                            O valor será transferido para o projeto após a confirmação do pagamento.
                        </Alert>

                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack gap="md">
                                {/* Informações Básicas */}
                                <Title order={3}>Informações da Doação</Title>
                                
                                <NumberInput
                                    withAsterisk
                                    label="Valor da Doação"
                                    placeholder="100.00"
                                    min={0.01}
                                    step={0.01}
                                    decimalScale={2}
                                    leftSection="R$"
                                    key={form.key('amount')}
                                    {...form.getInputProps('amount')}
                                />

                                <Select
                                    withAsterisk
                                    label="Projeto"
                                    placeholder="Selecione um projeto"
                                    data={projects}
                                    searchable
                                    key={form.key('project_id')}
                                    {...form.getInputProps('project_id')}
                                />

                                <Divider my="md" />

                                {/* Dados Pessoais */}
                                <Title order={3}>Dados Pessoais</Title>
                                
                                <TextInput
                                    withAsterisk
                                    label="Nome Completo"
                                    placeholder="Maria Santos"
                                    key={form.key('donor_name')}
                                    {...form.getInputProps('donor_name')}
                                />

                                <TextInput
                                    withAsterisk
                                    label="CPF"
                                    placeholder="000.000.000-00"
                                    key={form.key('cpf')}
                                    {...form.getInputProps('cpf')}
                                />

                                <TextInput
                                    withAsterisk
                                    label="Email"
                                    placeholder="maria@email.com"
                                    type="email"
                                    key={form.key('email')}
                                    {...form.getInputProps('email')}
                                />

                                <TextInput
                                    withAsterisk
                                    label="Telefone"
                                    placeholder="11999999999"
                                    key={form.key('cellphone')}
                                    {...form.getInputProps('cellphone')}
                                />

                                <Divider my="md" />

                                {/* Endereço */}
                                <Group gap="sm">
                                    <IconMapPin size={20} color="var(--mantine-color-blue-6)" />
                                    <Title order={3}>Endereço</Title>
                                </Group>
                                
                                <Group grow>
                                    <TextInput
                                        withAsterisk
                                        label="CEP"
                                        placeholder="00000-000"
                                        key={form.key('postal_code')}
                                        {...form.getInputProps('postal_code')}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label="Estado"
                                        placeholder="SP"
                                        maxLength={2}
                                        key={form.key('state')}
                                        {...form.getInputProps('state')}
                                    />
                                </Group>

                                <TextInput
                                    withAsterisk
                                    label="Cidade"
                                    placeholder="São Paulo"
                                    key={form.key('city')}
                                    {...form.getInputProps('city')}
                                />

                                <Group grow>
                                    <TextInput
                                        withAsterisk
                                        label="Endereço"
                                        placeholder="Rua das Flores"
                                        key={form.key('address')}
                                        {...form.getInputProps('address')}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label="Número"
                                        placeholder="123"
                                        key={form.key('number')}
                                        {...form.getInputProps('number')}
                                    />
                                </Group>

                                <Group grow>
                                    <TextInput
                                        label="Complemento"
                                        placeholder="Apto 45"
                                        key={form.key('complement')}
                                        {...form.getInputProps('complement')}
                                    />
                                    <TextInput
                                        withAsterisk
                                        label="Bairro"
                                        placeholder="Centro"
                                        key={form.key('neighborhood')}
                                        {...form.getInputProps('neighborhood')}
                                    />
                                </Group>

                                <Group justify="flex-end" mt="md">
                                    <Button 
                                        type="submit" 
                                        loading={loading} 
                                        disabled={loading}
                                        leftSection={<IconHeart size={16} />}
                                        size="md"
                                    >
                                        {loading ? 'Gerando Boleto...' : 'Gerar Boleto'}
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
