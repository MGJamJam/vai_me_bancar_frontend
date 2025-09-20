import {useForm} from "@mantine/form";
import {Button, Group, Textarea, TextInput} from "@mantine/core";
import { DateInput } from '@mantine/dates';


export default function RegisterProject() {
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

        try {
            const response = await fetch('/api/projects', {
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
        } catch (error) {
            console.error('Erro ao enviar projeto:', error);
            throw error;
        }
    };


    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                withAsterisk
                label="Nome do Projeto"
                placeholder="Chegar até a lua"
                key={form.key('projectName')}
                {...form.getInputProps('projectName')}
            />

            <Textarea
                withAsterisk
                label="Description"
                placeholder="Construit Foguetes, bora que bora."
                key={form.key('description')}
                {...form.getInputProps('description')}
            />

            <TextInput
                withAsterisk
                label="Nome"
                placeholder="Bianca Duarte"
                key={form.key('ownerName')}
                {...form.getInputProps('ownerName')}
            />

            <DateInput
                withAsterisk
                valueFormat="DD/MM/YYYY"
                label="Start date"
                placeholder=""
                key={form.key('startDate')}
                {...form.getInputProps('startDate')}
            />

            <DateInput
                withAsterisk
                valueFormat="DD/MM/YYYY"
                label="End date"
                placeholder=""
                key={form.key('endDate')}
                {...form.getInputProps('endDate')}
            />

            <TextInput
                withAsterisk
                label="Phone"
                placeholder="0728699213"
                key={form.key('cellphone')}
                {...form.getInputProps('cellphone')}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    );
}
