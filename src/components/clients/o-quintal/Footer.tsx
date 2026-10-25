import Link from "next/link";
import { oQuintal } from "@/content/o-quintal/facts";
import { oQuintalCategories } from "@/content/o-quintal/products";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon } from "./icons";
import { Wordmark } from "./Logo";

export function Footer({ mode }: { mode: OQuintalMode }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-ardosia text-giz">
      <div aria-hidden="true" className="oq-slats h-5 [--slat:20px]" />
      <div className="mx-auto grid max-w-[84rem] gap-10 px-4 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <p className="text-[1.8rem] [&_.text-folha]:text-limao">
            <Wordmark />
          </p>
          <p className="mt-4 max-w-xs text-giz/70">{oQuintal.tagline}.</p>
        </div>
        <nav aria-label="Loja">
          <p className="oq-stamp text-limao">Loja</p>
          <ul className="mt-4 space-y-1">
            {oQuintalCategories.map((category) => (
              <li key={category.id}>
                <Link href={oQuintalHref(mode, { kind: "shop", category: category.id })} className="inline-block py-1.5 text-giz/80 hover:text-giz">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="oq-stamp text-limao">Contactos</p>
          <ul className="mt-4 space-y-3 text-giz/85">
            <li>
              <a href={oQuintal.phoneHref} className="inline-flex items-center gap-2 py-1 hover:text-giz">
                <PhoneIcon className="h-4 w-4" /> {oQuintal.phoneDisplay}
              </a>
              <span className="block text-xs text-giz/55">{oQuintal.phoneNote}</span>
            </li>
            <li>
              <a href={`mailto:${oQuintal.email}`} className="inline-flex items-center gap-2 py-1 break-all hover:text-giz">
                <MailIcon className="h-4 w-4 shrink-0" /> {oQuintal.email}
              </a>
            </li>
            <li className="flex gap-2 pt-1">
              <a href={oQuintal.instagram} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-giz/25 hover:bg-giz/10" aria-label="Instagram (abre num novo separador)">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href={oQuintal.facebook} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-giz/25 hover:bg-giz/10" aria-label="Facebook (abre num novo separador)">
                <FacebookIcon className="h-5 w-5" />
              </a>
            </li>
          </ul>
        </div>
        <div className="text-sm text-giz/65">
          <p className="oq-stamp text-limao">Empresa</p>
          <p className="mt-4">{oQuintal.legal.company}</p>
          <p>NIF {oQuintal.legal.nif}</p>
          <p>{oQuintal.legal.address}</p>
        </div>
      </div>
      <div className="border-t border-giz/10">
        <div className="mx-auto flex max-w-[84rem] flex-col gap-4 px-4 py-6 text-sm text-giz/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {year} {oQuintal.name}. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={oQuintal.complaints} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-sm bg-giz px-3 py-1.5 font-semibold text-ardosia hover:bg-white">
              Livro de Reclamações
            </a>
            <a href="https://www.steevanz.com" target="_blank" rel="noopener" className="hover:text-giz">
              Site por Steevanz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
