'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';

interface AuthShellProps extends PropsWithChildren {
  pageLabel: string;
  title: string;
  description: string;
}

export function AuthShell({ pageLabel, title, description, children }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-clip bg-background font-zilla text-text">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-[22vw] -top-[20vw] h-[min(56vw,660px)] w-[min(56vw,660px)] rounded-xl"
          style={{
            transform: 'rotate(-16deg)',
            background:
              'conic-gradient(from 180deg, rgba(0, 145, 110, 0.2), rgba(53, 167, 255, 0.14))',
          }}
        />
        <div
          className="absolute bottom-[-50px] left-[8vw] h-[120px] w-[min(56vw,700px)]"
          style={{
            transform: 'skewX(-24deg)',
            background: 'linear-gradient(90deg, rgba(53, 167, 255, 0.2), rgba(0, 145, 110, 0))',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-wide px-lg pb-x3l pt-lg max-[760px]:px-md max-[760px]:pb-xl max-[760px]:pt-md">
        <header className="mb-xl flex items-center justify-between gap-lg max-[760px]:mb-lg max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-md">
          <Link
            href="/"
            className="inline-flex items-center gap-md text-inherit no-underline max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-sm"
          >
            <Image
              src="/logo-17suit@4x.svg"
              alt="17Suit"
              width={196}
              height={62}
              className="h-11 w-auto"
              priority
            />
            <span className="border-l border-black/10 pl-md text-md leading-[1.5] text-muted max-[760px]:border-l-0 max-[760px]:pl-0">
              Centro de autenticacion 17Suit
            </span>
          </Link>

          <nav className="flex gap-sm max-[760px]:w-full">
            <Link
              href="/sign-in"
              className="rounded-full border border-black/10 bg-white/90 px-md py-2 text-md font-bold leading-[1.4] tracking-plus1_25 text-brand-dark no-underline transition-transform duration-150 hover:-translate-y-px max-[760px]:flex-1 max-[760px]:text-center"
            >
              Iniciar sesion
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full border border-[#01695b] bg-gradient-to-r from-brand-secondary to-[#007666] px-md py-2 text-md font-bold leading-[1.4] tracking-plus1_25 text-white no-underline shadow-[0_10px_22px_rgba(0,145,110,0.24)] transition-transform duration-150 hover:-translate-y-px max-[760px]:flex-1 max-[760px]:text-center"
            >
              Registrarse
            </Link>
          </nav>
        </header>

        <section className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-start gap-md max-[960px]:grid-cols-1">
          <aside className="grid gap-md rounded-xl border border-black/10 bg-white/80 p-[clamp(24px,3.4vw,40px)] backdrop-blur">
            <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">
              {pageLabel}
            </p>
            <h1 className="m-0 max-w-[14ch] font-arvo text-[clamp(38px,7vw,72px)] leading-[1.08] tracking-[-0.015em] text-text">
              {title}
            </h1>
            <p className="m-0 max-w-[50ch] text-md leading-[1.5] text-muted">{description}</p>
            <ul className="m-0 grid list-none gap-sm p-0 text-md leading-[1.5] text-muted">
              <li className="flex items-start gap-sm">
                <span className="mt-[7px] h-[9px] w-[9px] shrink-0 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary" />
                <span>Una cuenta para todos los productos de la suite.</span>
              </li>
              <li className="flex items-start gap-sm">
                <span className="mt-[7px] h-[9px] w-[9px] shrink-0 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary" />
                <span>Flujo automatizado y redireccion por rol despues de ingresar.</span>
              </li>
              <li className="flex items-start gap-sm">
                <span className="mt-[7px] h-[9px] w-[9px] shrink-0 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary" />
                <span>Acceso seguro con Clerk y opciones de recuperacion rapida.</span>
              </li>
            </ul>
            <Link
              href="/"
              className="w-fit rounded-full border border-black/10 bg-white/90 px-md py-2 text-md font-bold leading-[1.4] tracking-plus1_25 text-brand-dark no-underline transition-transform duration-150 hover:-translate-y-px"
            >
              Volver al landing
            </Link>
          </aside>

          <section className="self-start rounded-lg border border-black/10 bg-white/80 p-[clamp(16px,2vw,20px)] backdrop-blur">
            {children}
          </section>
        </section>
      </div>
    </main>
  );
}
