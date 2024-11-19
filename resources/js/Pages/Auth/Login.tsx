'use client';

import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
        <form className="mt-8 space-y-6" onSubmit={submit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                  />
                  <InputError message={errors.email} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Senha"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                  />
                  <InputError message={errors.password} className="mt-2" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember-me"
                    checked={data.remember}
                    onCheckedChange={(checked) => setData('remember', checked as boolean)}
                  />
                  <Label htmlFor="remember-me" className="ml-2 block text-sm">
                    Lembrar-me
                  </Label>
                </div>

                {canResetPassword && (
                  <Link
                    href={route('password.request')}
                    className="font-medium text-primary hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                )}
              </div>

              <div>
                <Button type="submit" className="w-full" disabled={processing}>
                  Entrar
                </Button>
              </div>
            </form>
    </GuestLayout>
  );
}
