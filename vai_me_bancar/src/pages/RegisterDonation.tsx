import {useForm} from "@mantine/form";
import {Button, Group, NumberInput, Select, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";

export default function RegisterDonation() {
    const [projects, setProjects] = useState<Array<{value: string, label: string}>>([]);
    const [loading, setLoading] = useState(false);

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
            project_id: ''
        },

        validate: {
            amount: (value) => (!value || parseFloat(value) <= 0 ? 'Valor deve ser maior que zero' : null),
            donor_name: (value) => (!value ? 'Nome do doador é obrigatório' : null),
            cellphone: (value) => (!value ? 'Telefone é obrigatório' : null),
            project_id: (value) => (!value ? 'Projeto é obrigatório' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);

        try {
            // send data to backend
            console.log(JSON.stringify(values));

            const payload = {
                amount: parseFloat(values.amount),
                status: "pending", // Status padrão para nova doação
                project_id: parseInt(values.project_id),
                donor_name: values.donor_name,
                cellphone: values.cellphone,
                // Campos opcionais do Asaas serão preenchidos pelo backend
                asaas_cliente_id: null,
                asaas_cobranca_id: null
            };

            console.log('Payload sendo enviado:', payload);

            const response = await fetch('https://vaimebancar.codegus.com/api/donates', {
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
            console.log('Doação criada com sucesso:', data);

            // Limpar o formulário após sucesso
            form.reset();
            alert('Doação registrada com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar doação:', error);
            alert('Erro ao registrar doação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <NumberInput
                withAsterisk
                label="Valor da Doação"
                placeholder="100.00"
                min={0.01}
                step={0.01}
                decimalScale={2}
                key={form.key('amount')}
                {...form.getInputProps('amount')}
            />

            <TextInput
                withAsterisk
                label="Nome do Doador"
                placeholder="Maria Santos"
                key={form.key('donor_name')}
                {...form.getInputProps('donor_name')}
            />

            <TextInput
                withAsterisk
                label="Telefone"
                placeholder="11999999999"
                key={form.key('cellphone')}
                {...form.getInputProps('cellphone')}
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

            <Group justify="flex-end" mt="md">
                <Button type="submit" loading={loading} disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Doação'}
                </Button>
            </Group>
        </form>
    );
}
