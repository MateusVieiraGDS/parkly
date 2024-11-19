import ApplicationLogo from '@/components/ApplicationLogo';
import ParticlesBackground from '@/components/ParticlesBackground';
import { Link } from '@inertiajs/react';
import { Car } from 'lucide-react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <>   
        <div className="flex h-screen">
          {/* Lado esquerdo - Formulário de login */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 shadow-2xl z-[99]">
            <div className="w-full max-w-md space-y-8">
              <div className="flex flex-col items-center justify-center text-center">
                <Car className="h-12 w-12 text-primary" />
                <h2 className="mt-3 text-3xl font-bold tracking-tight">Sistema Interno Parkly</h2>
              </div>
              {children}
            </div>
          </div>
  
          {/* Lado direito */}
          <div className="hidden lg:block lg:w-1/2 bg-gray-100">
            <ParticlesBackground className="z-[-1] opacity-40"/>
          </div>
        </div>
      </>
    );
}
