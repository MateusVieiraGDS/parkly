import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const formSchema = z.object({
    cpf: z
        .string({
            message: "O CPF deve ser informado",
        })
        .min(11, {
            message: "O CPF deve ter no mínimo 11 caracteres",
        })
        .max(14, {
            message: "O CPF deve ter no máximo 14 caracteres",
        }),
    name: z
        .string({
            message: "O nome deve ser informado",
        })
        .min(3, {
            message: "O nome deve ter no mínimo 3 caracteres",
        })
        .max(50, {
            message: "O nome deve ter no máximo 50 caracteres",
        }),
    phone: z
        .string({
            message: "O celular deve ser preenchido",
        }),
    email: z
        .string({
            message: "O email deve ser informado",
        })
        .email({
            message: "O email deve ser válido",
        })
        .min(3, {
            message: "O nome deve ter no mínimo 3 caracteres",
        })
        .max(50, {
            message: "O nome deve ter no máximo 50 caracteres",
        }),
});

export const formSchemaEdit = z.object({
    name: z
        .string()
        .min(3, {
            message: "O nome deve ter no mínimo 3 caracteres",
        })
        .max(50, {
            message: "O nome deve ter no máximo 50 caracteres",
        }),
    nickname: z.nullable(
        z.string().max(20, {
            message: "O apelido deve ter no máximo 20 caracteres",
        })
    ),
    birth: z.nullable(
        z
            .string()
            .min(10, {
                message:
                    "A data de nascimento deve ter no mínimo 10 caracteres",
            })
            .max(10, {
                message:
                    "A data de nascimento deve ter no máximo 10 caracteres",
            })
    ),
    sex: z.string().min(1, {
        message: "O sexo deve ser informado",
    }),
    phone: z
        .string({
            message: "O celular deve ser preenchido",
        }),
    email: z
        .optional(
            z.string().max(50, {
                message: "O email deve ter no máximo 50 caracteres",
            })
        )
        .nullable(),

    facebook: z.nullable(
        z.string().max(50, {
            message: "O facebook deve ter no máximo 50 caracteres",
        })
    ),
    instagram: z.nullable(
        z.string().max(50, {
            message: "O Instagram deve ter no máximo 50 caracteres",
        })
    ),
    twitter: z.nullable(
        z.string().max(50, {
            message: "O twitter/X deve ter no máximo 50 caracteres",
        })
    ),
    postal_code: z.nullable(
        z.string().max(9, {
            message: "O CEP deve ter no máximo 9 caracteres",
        })
    ),
    street: z.nullable(
        z.string().max(100, {
            message: "O Endereço deve ter no máximo 100 caracteres",
        })
    ),
    street_number: z.nullable(
        z.string().max(10, {
            message: "O Endereço deve ter no máximo 10 caracteres",
        })
    ),
    complement: z.nullable(
        z.string().max(50, {
            message: "O Endereço deve ter no máximo 50 caracteres",
        })
    ),
    district_id: z.nullable(
        z.string({
            message: "O Bairro deve ser informado",
        })
    ),
    categories: z.unknown(),
});
