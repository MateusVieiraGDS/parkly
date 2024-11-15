import { router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
Form,
FormControl,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImagemCropUpload from "./image-upload-cropper";
import { withMask } from "use-mask-input";
import { cn } from "@/lib/utils";


const formSchema = z.object({
        nome: z.string().min(2, { message: "Nome é obrigatório e deve ter pelo menos 2 caracteres." }),
        dataNasc: z.date({ required_error: "Data de nascimento é obrigatória." }),
        sexo: z.enum(["MASCULINO", "FEMININO"], { invalid_type_error: "Selecione o sexo." }),
        cpf: z.string().min(11, { message: "CPF é obrigatório e deve ter 11 dígitos." }),
        rg: z.string().min(9, { message: "RG é obrigatório e deve ter 9 dígitos." }),
        rgUf: z.string().min(2, { message: "UF do RG é obrigatória." }),
        nomeMae: z.string().min(2, { message: "Nome da mãe é obrigatória e deve ter pelo menos 2 caracteres." }),
        nomePai: z.string().min(2, { message: "Nome do pai é obrigatória e deve ter pelo menos 2 caracteres." }),        
        estado: z.string().nonempty({ message: "Selecione um estado." }),
        cidade: z.string().nonempty({ message: "Selecione uma cidade." }),
        estadoCivil: z.enum(["solteiro", "casado", "divorciado", "viuvo"]),
        imageFile34: z.optional(z.instanceof(File)),
        imageFileCas: z.optional(z.instanceof(File)),
        imageFileDiv: z.optional(z.instanceof(File)),
        imageFileObt: z.optional(z.instanceof(File)),
        imageFileDoc: z.optional(z.instanceof(File)),
        imageFileNasc: z.optional(z.instanceof(File)),
    });

    // Interface de dados do formulário
    type FormData = z.infer<typeof formSchema>;

function parseDateYmd(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

const NewMemberForm = () => {        
    const { states_cities, user } = usePage().props as any;
    const [filteredCities, setFilteredCities] = useState<any[]>([])

    /*
        nome: '',
        dataNasc: '',
        sexo: '',
        cpf: '',
        rg: '',
        rgUf: '',
        estado: '',
        cidade: '',
        nomeMae: '',
        nomePai: '',
        imageFile34: null,
        imageFileDoc: null,
        imageFileNasc: null,
        imageFileCas: null,
        imageFileDiv: null,
        imageFileObt: null
    */
   console.log(user);
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
            defaultValues: {
                nome: user?.name ?? "",
                dataNasc: user?.membro?.nasc ? parseDateYmd(user?.membro?.nasc) : new Date(),
                sexo: user?.membro?.sexo ?? "",
                cpf: user?.membro?.cpf ?? "",
                rg: user?.membro?.rg ?? "",
                estado: user?.membro?.nat_state?.uf ?? "",
                cidade: (user?.membro?.nat_city?.id ?? "") + "",
                estadoCivil: (user?.membro?.estado_civil ?? "solteiro").toLowerCase(),
                nomeMae: user?.membro?.dados_complmentar?.nome_mae ?? "",
                nomePai: user?.membro?.dados_complmentar?.nome_pai ?? "",
                imageFile34: undefined,
                imageFileCas: undefined,
                imageFileDiv: undefined,
                imageFileObt: undefined,
                imageFileDoc: undefined,
                imageFileNasc: undefined,
        },
    })

    const { watch, setValue, handleSubmit, control } = form
    const selectedState = watch("estado")
    const estadoCivil = watch("estadoCivil")

    useEffect(() => {
        setFilteredCities(selectedState ? states_cities.find((state: any) => state.uf === selectedState)?.cities || [] : [])
    }, [selectedState])

    const getConditionalUploads = () => {
        switch (estadoCivil) {
            case "casado":
                return { imageFileCas: true, imageFileDiv: false, imageFileObt: false }
            case "divorciado":
                return { imageFileCas: false, imageFileDiv: true, imageFileObt: false }
            case "viuvo":
                return { imageFileCas: false, imageFileDiv: false, imageFileObt: true }
            default:
                return { imageFileCas: false, imageFileDiv: false, imageFileObt: false }
        }
    }

    const onSubmit = (data: FormData) => {
        router.post(route("dashboard.membros.insert"), data, {
            /* onSuccess: () => {
                form.reset()
            } */
            preserveScroll: true,
            preserveState: true,
        })
    }


    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={control}
                    name="cpf"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                            <Input {...field} type="text" placeholder="000.000.000-00" ref={withMask('999.999.999-99')} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="rg"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>RG</FormLabel>
                        <FormControl>
                            <Input placeholder="Digite o RG" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="rgUf"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                                <Select onValueChange={(value) => setValue("rgUf", value)} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Estado de emissão do RG" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {states_cities.map((state: any, index: number) => (
                                            <SelectItem key={index} value={state.uf}>
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
                    name="nome"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                            <Input placeholder="Nome do membro" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                control={control}
                name="dataNasc"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "Selecione uma data"}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => setValue("dataNasc", date || new Date())}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                    control={control}
                    name="sexo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sexo</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o sexo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MASCULINO">Masculino</SelectItem>
                                        <SelectItem value="FEMININO">Feminino</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="estado"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                                <Select onValueChange={(value) => setValue("estado", value)} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {states_cities.map((state: any, index: number) => (
                                            <SelectItem key={index} value={state.uf}>
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
                                <Select onValueChange={(value) => setValue("cidade", value)} defaultValue={field.value} disabled={!selectedState}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma cidade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredCities.map((city) => (
                                            <SelectItem key={city.id} value={city.id+""}>
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
                    name="nomeMae"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nome da Mãe</FormLabel>
                        <FormControl>
                            <Input placeholder="Nome da mãe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                /><FormField
                    control={control}
                    name="nomePai"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Insira o nome do pai</FormLabel>
                        <FormControl>
                            <Input placeholder="Nome do pai" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="estadoCivil"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado Civil</FormLabel>
                            <FormControl>
                                <Select onValueChange={(value) => setValue("estadoCivil", value as any)} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o estado civil" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="solteiro">Solteiro</SelectItem>
                                        <SelectItem value="casado">Casado</SelectItem>
                                        <SelectItem value="divorciado">Divorciado</SelectItem>
                                        <SelectItem value="viuvo">Viuvo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="imageFileDoc"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Foto do Documento</FormLabel>
                        <FormControl>
                            <ImagemCropUpload initialSource={user?.membro?.file_doc_image?.pathname} setImages={(img: any) => setValue("imageFileDoc", img)}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="imageFileNasc"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Foto da Certidão de Nascimento</FormLabel>
                        <FormControl>
                            <ImagemCropUpload initialSource={user?.membro?.file_cert_nascimento?.pathname} setImages={(img: any) => setValue("imageFileNasc", img)}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {getConditionalUploads().imageFileCas && (
                    <FormField
                        control={control}
                        name="imageFileCas"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Foto da Certidão de Casamento</FormLabel>
                            <FormControl>
                                <ImagemCropUpload  setImages={(img: any) => setValue("imageFileCas", img)}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {getConditionalUploads().imageFileObt && (
                    <FormField
                        control={control}
                        name="imageFileObt"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Foto da Certidão de Óbito</FormLabel>
                            <FormControl>
                                <ImagemCropUpload  setImages={(img: any) => setValue("imageFileObt", img)}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {getConditionalUploads().imageFileDiv && (
                    <FormField
                        control={control}
                        name="imageFileDiv"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Foto da Certidão de Divórcio</FormLabel>
                            <FormControl>
                                <ImagemCropUpload  setImages={(img: any) => setValue("imageFileDiv", img)}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <Button type="submit">Enviar</Button>
            </form>
        </Form> 
    )
}

export default NewMemberForm;