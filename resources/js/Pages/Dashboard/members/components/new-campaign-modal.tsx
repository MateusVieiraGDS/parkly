import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { cn, validationFormErrors } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { withMask } from "use-mask-input";
import { ListCityModal } from "@/components/modal/list-city-modal";
import { City } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { InputPassword } from "@/components/ui/input-password";
import { router } from "@inertiajs/react";


export const NewCampaignModal = ({open, setOpen} : {open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) => {


    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState(null as City | null);


    useEffect(() => {
        if (city) {
            const city_id = parseInt(city.id, 10);
            form.setValue("city_id" as keyof ContactFormValues, city_id as any);
            form.clearErrors("city_id" as keyof ContactFormValues);
        }
    }, [city]);



    const contactFormSchema = z.object({
        phone: z
            .string()
            .min(10, { 
                message: "Telefone é obrigatório e deve ter no mínimo 10 caracteres." 
            })
            .optional().or(z.literal('')),
    
        advisorPhone: z
            .string()
            .min(10, { 
                message: "Telefone do Assessor é obrigatório e deve ter no mínimo 10 caracteres." 
            })
            .optional().or(z.literal('')),
    
        advisorName: z
            .string()
            .min(3, { 
                message: "Nome do assessor deve ter no mínimo 3 caracteres." 
            })
            .optional().or(z.literal('')),
    
        email: z
            .string()
            .email({
                message: "Email inválido." 
            })
            .optional().or(z.literal('')),
    
        nome_urna: z
            .string({
                message: "O nome do candidato é obrigatório",
            })
            .min(3, {
                message: "O nome do candidato deve ter no mínimo 3 caracteres",
            })
            .max(255, {
                message: "O nome do candidato deve ter no máximo 255 caracteres",
            }),
    
        position: z.string({
            message: "O cargo político é obrigatório",
        }),
    
        city_id: z
            .number({
                message: "A cidade é obrigatória",
            }),
    
        numero_candidato: z
            .string({
                message: "O número do candidato é obrigatório",
            })
            .refine(value => !isNaN(Number(value)), {
                message: "O número do candidato deve ser um valor numérico",
            }),
    })
    

    // Inferindo tipos a partir do schema
    type ContactFormValues = z.infer<typeof contactFormSchema>;

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            phone: "",
            advisorPhone: "",
            email: "",
        },
    });

    // Definindo o tipo da função onSubmit com base no schema
    const onSubmit: SubmitHandler<ContactFormValues> = (values) => {
        if (loading) return;
        setLoading(true);

        router.post(route('admin.campanhas.store'), values, {
            onSuccess: (res) => {
                //console.log(res);
            },
            onError: (err) => {
                //console.log(err);
            },
            onFinish: () => {
                setLoading(false);
            }
        });

    };

    
    const handleClose = ({}) => {
        setOpen(false);
        form.reset();
    }

    return (
        <div className={cn("bg-black/50 w-screen h-screen top-0 left-0 flex justify-center items-center", open ? "fixed" : "hidden")}>
            <div className="bg-muted p-8 rounded-2xl shadow-2xl md:min-w-[600px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                                        <div className="mt-2">
                            <h2 className="text-2xl font-bold">Dados de Candidatura</h2>
                        </div>                        
                        <div className="md:flex md:gap-2 w-full">                            
                            <FormField                            
                                name="nome_urna"
                                control={form.control}
                                disabled={loading}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                    <FormLabel>Nome de urna</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value as string} placeholder="Nome do urna do candidato" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />                          
                            <FormField
                            name="numero_candidato"
                            control={form.control}
                            disabled={loading}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Número</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value as string} placeholder="00000" inputMode="numeric" ref={withMask("99[999]")} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="md:flex md:gap-2 w-full">
                            <FormField
                            name="position"
                            control={form.control}
                            disabled={loading}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel>Cargo político</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value as string}
                                >
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Cargo político" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="prefeito">
                                        Prefeito
                                    </SelectItem>
                                    <SelectItem value="vereador">
                                        Vereador
                                    </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            name="city_id"
                            control={form.control}
                            disabled={loading}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel>Cidade</FormLabel>
                                <FormControl>
                                    <ListCityModal
                                    city={city}
                                    onSelected={setCity}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                    <Separator className="mt-5" />
                    <div className="mt-2">
                        <h2 className="text-2xl font-bold">Dados de Contato</h2>
                    </div>
                    <div className="md:flex md:gap-2 w-full">
                        <div className="space-y-2">
                        <FormField
                            control={form.control}
                            disabled={loading}
                            name="phone"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                <Input type="tel" inputMode="numeric" {...field} placeholder="(XX) 00000 0000" ref={withMask(["(99) 9999-9999", "(99) 99999-9999"])} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </div>
                        <div className="space-y-2 md:w-[70%]">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Insira seu email" {...form.register("email")} />
                        <p className="text-red-500">{form.formState.errors.email?.message}</p>
                        </div>
                    </div>
                    <div className="md:flex md:gap-2 w-full">
                        <div className="space-y-2">
                        <FormField
                            control={form.control}
                            disabled={loading}
                            name="advisorPhone"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefone do Assessor</FormLabel>
                                <FormControl>
                                <Input type="tel" inputMode="numeric" {...field} placeholder="(XX) 00000 0000" ref={withMask(["(99) 9999-9999", "(99) 99999-9999"])} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </div>
                        <FormField
                        name="advisorName"
                        control={form.control}
                        disabled={loading}
                        render={({ field }) => (
                            <FormItem className="md:w-[70%]">
                            <FormLabel>Nome do Assessor</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Insira o nome do assessor" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <Separator className="mt-5" />
                    <div className="flex mt-5 gap-4 justify-end">
                        <Button type="button" variant={"destructive"} onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="" disabled={loading}>
                            {loading ?
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Criando Campanha ...
                            </>
                            :
                            <>
                                Criar Campanha
                            </>
                            }
                        </Button>
                    </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}