import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    quantity: z.string(),
});

type FormValues = {
    user_id: number;
    quantity: string;
};

export const CampaignAvailable = ({user}: {user: any}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { auth } = usePage().props as any;
    const user_id = parseInt(auth.user.id ?? "") as any;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user_id: user_id,
            quantity: "1",
        },
    });

    const handleSubmit = (values: FormValues) => {
        values.user_id = user.id;
        router.put(route("campaign-available.add", values.user_id), values, {
            preserveScroll: true,
            preserveState: true,
            onBefore: () => {
                setLoading(true);
            },
            onSuccess: () => {
                toast.success("Campanha adicionada com sucesso");
                setLoading(false);
                setIsOpen(false);
            },
            onError: (errors) => {
                if (typeof errors === "object") {
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
                    toast.error("Ocorreu um erro!");
                }
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <>
            <Card className=" flex flex-col justify-between">
                <CardHeader>
                    <CardTitle>Campanhas</CardTitle>
                    <CardDescription>Campanhas disponíveis</CardDescription>
                </CardHeader>
                <CardContent>{user.registered_campaign_quantity ?? 0} de {user.campaign_available}</CardContent>
                <CardFooter>
                    <Button onClick={() => setIsOpen(true)}>
                        Adicionar campanha
                    </Button>
                </CardFooter>
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Disponibilizar campanha</DialogTitle>
                        <DialogDescription>
                            Informe a quantidade de campanhas que deseja
                            acrescentar
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="flex flex-col gap-4"
                        >
                            <Form {...form}>
                                <FormField
                                    name="quantity"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Disponibilizar +
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="mt-4"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading && (
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    )}
                                    Salvar
                                </Button>
                            </Form>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
