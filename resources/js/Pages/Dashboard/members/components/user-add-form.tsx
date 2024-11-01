import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { formSchema } from "./formSchema";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { withMask } from "use-mask-input";
import { useUserForm } from "./use-user-form";

type FormValues = {
    id?: number;
    cpf: string;
    name: string;
    phone: string;
    email: string;
};

type Props = {
    initialValues?: FormValues;
};

export const UserAddForm = ({ initialValues }: Props) => {
    const [loading, setLoading] = useState(false);
    const { onClose } = useUserForm();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cpf: "",
            name: "",
            phone: "",
            email: "",
        },
    });

    const handleSubmit = (values: FormValues) => {
        if (!initialValues) {
            insert(values);
        } else {
            update(values);
        }
    };

    const insert = (values: FormValues) => {
        router.post(route("usuarios.store"), values, {
            onBefore: () => setLoading(true),
            onSuccess: () => {
                onClose();
                form.reset();
                toast.success("Usuário adicionado com sucesso");
            },
            onError: (errors) => {
                if (typeof errors === "object") {
                    const e = Object.values(errors);
                    const allErrors = Object.entries(errors);
                    for (let i = 0; i < allErrors.length; i++) {
                        const message = {
                            message: allErrors[i][1],
                            type: "server",
                        } as any;
                        const name = allErrors[i][0] as any;
                        form.setError(name, message);
                    }
                } else {
                    toast.error("Erro ao excluir bairro!");
                }
            },
            onFinish: () => setLoading(false),
        });
    };

    const update = (values: FormValues) => {
        router.put(route("usuarios.update", initialValues?.id), values, {
            onBefore: () => setLoading(true),
            onSuccess: () => {
                form.reset();

                toast.success("Usuário atualizado com sucesso");
            },
            onError: (errors) => {
                if (typeof errors === "object") {
                    const e = Object.values(errors);
                    const allErrors = Object.entries(errors);
                    for (let i = 0; i < allErrors.length; i++) {
                        const message = {
                            message: allErrors[i][1],
                            type: "server",
                        } as any;
                        const name = allErrors[i][0] as any;
                        form.setError(name, message);
                    }
                } else {
                    toast.error("Erro ao excluir bairro!");
                }
            },
            onFinish: () => setLoading(false),
        });
    };

    useEffect(() => {
        if (initialValues) {
            form.setValue("cpf", initialValues.cpf || "");
            form.setValue("name", initialValues.name || "");
            form.setValue("phone", initialValues.phone || "");
            form.setValue("email", initialValues.email || "");
        }
    }, [initialValues]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 pt-4"
            >
                <FormField
                    name="cpf"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={loading}
                                    {...field}
                                    ref={withMask("999.999.999-99")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input disabled={loading} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                                <Input disabled={loading} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    <Button className="w-full mt-8" disabled={loading}>
                        {initialValues ? "Atualizar" : "Adicionar"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
