import { type ClassValue, clsx } from "clsx";
import { format, formatRelative, setDefaultOptions } from "date-fns";
import { twMerge } from "tailwind-merge";
import { ptBR } from "date-fns/locale";
import { User } from "@/types";
import { toast } from "sonner";
import { phoneNormalizeSet } from "./helpers";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDateRange(from: Date, to: Date) {
    setDefaultOptions({ locale: ptBR });
    return `${format(from, "d MMMM")} - ${format(to, "d MMMM")}`;
}

export function validationFormErrors(errors: any, form: any) {
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
}

export function avatarName(name: string) {
    try {
        const firstName = name.split(" ")[0].split("")[0];
        const lastName = name
            .split(" ")
            [name.split(" ").length - 1].split("")[0];
        return (firstName + lastName).toUpperCase();
    } catch (error) {
        return "NO";
    }
}

export const zipCodeMask = (cep: string) => {
    if (!cep) return "";
    cep = cep.replace(/\D/g, "");
    cep = cep.replace(/(\d{5})(\d)/, "$1-$2");
    return cep;
};

export const phoneMask = (phone: string) => {
    if (!phone) return "";

    // Remove todos os caracteres não numéricos
    phone = phoneNormalizeSet(phone, false);

    // Verifica o comprimento do número para determinar se é telefone fixo ou celular
    if (phone.length === 12) { // Telefone fixo no formato 55 + código de área + número
        phone = phone.replace(/^(\d{2})(\d{2})(\d{4})(\d{4})$/, "+$1 ($2) $3-$4");
    } else if (phone.length === 13) { // Celular no formato 55 + código de área + número
        phone = phone.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, "+$1 ($2) $3-$4");
    } else {
        return "(--) ----- ----";
    }

    return phone;
};

export const hasPermission = (
    menuPermissions: string[],
    permission: string,
    environment: string
) => {
    if (permission === "admin") {
        return true;
    }

    if (environment !== "local" && permission === "development") {
        return false;
    }

    if (menuPermissions.includes(permission)) {
        return true;
    }

    return false;
};

export const hasPosition = (
    menuPosition: string[] | null,
    position: string,
    permission: string = '',    
) => {
    if (permission === "admin") {
        return true;
    }

    if (menuPosition == null || menuPosition.includes(position)) {
        return true;
    }

    return false;
};

//Return only numbers
export const onlyNumbers = (value: string) => {
    return value.replace(/\D/g, "");
};


//Check if is empty
/**
 * Check if a value is empty
 * @param value The value to check
 * @returns true if the value is empty
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const empty = (value: any) => {
    if (value === null || value === undefined) return true;

    if (typeof value === 'boolean') return !value;

    if (typeof value === 'number') return value === 0;

    if (typeof value === 'string') return value.trim() === '';

    if (Array.isArray(value)) return value.length === 0;

    if (typeof value === 'object') return Object.keys(value).length === 0;

    return false;
}


/**
 * Formata um número como CPF ou CNPJ dependendo da quantidade de dígitos.
 * 
 * @param {string} valor - O CPF ou CNPJ a ser formatado, com ou sem pontuação.
 * @returns {string} O valor formatado como CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00).
 * @throws {Error} Se o valor não tiver 11 ou 14 dígitos.
 */
export const maskCpfCnpj = (valor: any) => {
    valor = valor.replace(/\D/g, '');

    if (valor.length === 11) {
        return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (valor.length === 14) {
        return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
        return "";
        throw new Error("O valor deve conter 11 dígitos para CPF ou 14 dígitos para CNPJ.");
    }
}