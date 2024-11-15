import { zodResolver } from "@hookform/resolvers/zod";
import { router, usePage } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { formSchemaEdit } from "./formSchema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/multi-select";
import { withMask } from "use-mask-input";

type FormValues = {
    id?: string | null;
    name: string;
    nickname: string;
    birth: string;
    phone: string;
    email: string;
    facebook: string;
    instagram: string;
    twitter: string;
    sex: string;
    level: string;
    postal_code: string;
    street: string;
    street_number: string;
    complement: string;
    district_id: string;
    categories: string[];
};

export const PeopleEditForm = () => {
    const people = usePage().props.people as FormValues;
    const listAllDistricts = usePage().props.listAllDistricts as any;
    const categories = usePage().props.categories as any;
    const [disabled, setDisabled] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchemaEdit),
        defaultValues: {
            id: people.id,
            name: people.name || "",
            nickname: people.nickname || "",
            birth: people.birth,
            sex: people.sex.toString(),
            phone: people.phone || "",
            email: people.email || "",
            facebook: people.facebook || "",
            instagram: people.instagram || "",
            twitter: people.twitter || "",
            postal_code: people.postal_code || "",
            street: people.street || "",
            street_number: people.street_number || "",
            complement: people.complement || "",
            district_id: people.district_id ? people.district_id.toString() : "",
            level: people.level,
            categories: [],
        },
    });

    const handleSubmit = (values: FormValues) => {
        router.put(route("contatos.update", [people.id]), values, {
            preserveScroll: true,
            onBefore: () => {
                setDisabled(true);
            },
            onSuccess: () => {
                toast.success("Contato atualizado com sucesso");
                setDisabled(false);
            },
            onError: (errors) => {
                toast.error("Ocorreu um erro!");
                setDisabled(false);
            },
        });
    };

    useEffect(() => {
        if (people?.categories?.length > 0) {
            const categories = people.categories.map((category: any) => {
                return category.id;
            });
            form.setValue("categories", categories);
        }
    }, []);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="bg-slate-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={disabled}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="nickname"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Apelido</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={disabled}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="birth"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Data de Nascimento
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                disabled={disabled}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="sex"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sexo</FormLabel>
                                        <FormControl>
                                            <Select
                                                disabled={disabled}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value.toString()}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sexo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="2">
                                                            Feminino
                                                        </SelectItem>
                                                        <SelectItem value="1">
                                                            Masculino
                                                        </SelectItem>
                                                        <SelectItem value="3">
                                                            LGBTQI+
                                                        </SelectItem>
                                                        <SelectItem value="4">
                                                            Não informado
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="level"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Rede de engajamento
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                disabled={disabled}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value.toString()}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Rede" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="1">
                                                            Próximo
                                                        </SelectItem>
                                                        <SelectItem value="2">
                                                            Engajado
                                                        </SelectItem>
                                                        <SelectItem value="3">
                                                            Multiplicado
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="categories"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categorias</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={categories.map(
                                                    (category: any) => {
                                                        return {
                                                            value: category.id,
                                                            label: category.name,
                                                        };
                                                    }
                                                )}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                placeholder="Selecione as categorias" // optional
                                                animation={0} // optional
                                                variant="secondary" // optional
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                name="phone"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Celular</FormLabel>
                                        <FormControl>

                                            <Input
                                                type="tel"
                                                {...field}
                                                placeholder="(00) 00000 0000"
                                                ref={withMask(["(99) 9999-9999", "(99) 99999-9999"])}
                                            />

                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={disabled}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="facebook"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Facebook</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={disabled}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="instagram"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instagram</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={disabled}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="twitter"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Twitter / X</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={disabled}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end p-4 bg-gray-50/50 border  mt-4 my-2 rounded-md">
                        <Button disabled={disabled} type="submit">
                            Salvar
                        </Button>
                    </div>
                </div>
            </form>

            {/* <pre>{JSON.stringify(categories, null, 2)}</pre> */}
        </Form>
    );
};
