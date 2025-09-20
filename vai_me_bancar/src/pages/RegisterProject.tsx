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
            budget: values.budget,
            goal_amount: values.goalAmount,
            start_date: values.startDate ? new Date(values.startDate).toISOString().split('T')[0] : null,
            end_date: values.endDate ? new Date(values.endDate).toISOString().split('T')[0] : null,
            owner_name: values.ownerName,
            cellphone: values.cellphone,
        };

        try {
            const response = await fetch('https://vaimebancar.codegus.com/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            // if (!response.ok) {
            //     throw new Error(`Erro na requisição: ${response.status}`);
            // }

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
