import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { withMask } from "use-mask-input";
import { onlyNumbers } from "@/lib/utils";
import { set } from "date-fns";
import ImagemCropUpload from "./image-upload-cropper";
import { toast } from "sonner";

const formSchema = z.object({
    rua: z.string().nonempty("Rua é obrigatória"),
    numero: z.string().nonempty("Número é obrigatório"),
    bairro: z.string().nonempty("Bairro é obrigatória"),
    cidade: z.string().nonempty("Cidade é obrigatória"),
    uf: z.string().nonempty("Estado é obrigatório"),
    complemento: z.string().optional(),
    cep: z.string().nonempty("CEP é obrigatório"),
    email: z.string().email("Email inválido"),
    telefone: z.string().nonempty("Telefone é obrigatório"),
    imageFileResidencia: z.optional(z.instanceof(File)),
});

type FormData = z.infer<typeof formSchema>;

export default function FormEnderecoContato() {
    const { user, states_cities } = usePage().props as any;
    const [filteredCities, setFilteredCities] = useState<any[]>([]);
    const [addressFound, setAddressFound] = useState(false);
    const [cityLoading, setCityLoading] = useState(null);

    const { watch, setValue, handleSubmit, control } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rua: user?.membro?.endereco?.rua || "",
            numero: user?.membro?.endereco?.numero || "",
            bairro: user?.membro?.endereco?.bairro || "",
            cidade: user?.membro?.endereco?.cidade_id || "",
            uf: user?.membro?.endereco?.uf || "",
            complemento: user?.membro?.endereco?.complemento || "",
            cep: user?.membro?.endereco?.cep || "",
            email: user?.email || "",
            telefone: user?.membro?.contato?.telefone || "",
            imageFileResidencia: undefined,
        },
    });

    const cep = watch("cep");
    const uf = watch("uf");

    useEffect(() => {
        if (uf) {
            const selectedState = states_cities.find((state: any) => state.uf === uf);
            setFilteredCities(selectedState ? selectedState.cities : []);
        }
    }, [uf]);

    useEffect(() => {
        if (cityLoading) {
            setValue("cidade", cityLoading);
            setCityLoading(null);
        }
    }, [filteredCities]);

    const handleSearchAddressByCep = async (cepValue: string) => {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json`);
        const responseData = response.ok ? await response.json() : null;
        

        if (responseData && !responseData.erro) {
            const selectedState = states_cities.find((state: any) => state.uf === responseData.uf);
            const city = selectedState?.cities.find((city: any) => city.name === responseData.localidade);
            
            if(city)
                setCityLoading(city.id);

            setValue("rua", responseData.logradouro);
            setValue("bairro", responseData.bairro);            
            setValue("uf", responseData.uf);            

            setAddressFound(true);
        } else {
            setAddressFound(false);
        }
    };

    useEffect(() => {
        if (onlyNumbers(cep ?? "").length >= 8) handleSearchAddressByCep(cep);
    }, [cep]);

    const onSubmit = (formData: FormData) => {
        router.put(route("dashboard.membros.updateContact", [user.id]), formData, {            
            onSuccess: () => {
                toast.success("Endereço e contato atualizados com sucesso!");
            },
        });
    };

    return (
        <Form {...control}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={control}
                    name="cep"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="00000-000"
                                    ref={withMask("99999-999")}
                                    className="w-full"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="rua"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rua</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Digite a rua" disabled={!addressFound} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="numero"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Digite o número" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="bairro"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Digite o bairro" disabled={!addressFound} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="complemento"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Digite o complemento" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="uf"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => setValue("uf", value)}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {states_cities.map((state: any) => (
                                            <SelectItem key={state.uf} value={state.uf}>
                                                {state.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="cidade"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => setValue("cidade", value)}
                                    value={field.value}
                                    disabled={!uf}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a cidade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredCities.map((city: any) => (
                                            <SelectItem key={city.id} value={city.id.toString()}>
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Digite o email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="telefone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="(00) 0000-0000" ref={withMask("(99) 9 9999-9999")} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="imageFileResidencia"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Foto do Documento</FormLabel>
                        <FormControl>
                            <ImagemCropUpload initialSource={user?.membro?.file_doc_image?.pathname} setImages={(img: any) => setValue("imageFileResidencia", img)}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Enviar</Button>
            </form>
        </Form>
    );
}
